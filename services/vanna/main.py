from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from groq import Groq
import json
from dotenv import load_dotenv
from pathlib import Path
import asyncio

# Load environment variables from .env file
# Try multiple methods to ensure .env is loaded
script_dir = Path(__file__).parent
env_path = script_dir / '.env'

# Try loading from script directory first
result1 = load_dotenv(dotenv_path=env_path, override=True)
# Also try loading from current working directory
result2 = load_dotenv(override=False)

# Debug: Print if DATABASE_URL is loaded
database_url = os.getenv("DATABASE_URL")
if database_url:
    print("[OK] DATABASE_URL loaded successfully")
else:
    print("[WARNING] DATABASE_URL not found.")
    print(f"   Tried loading from: {env_path}")
    print(f"   File exists: {env_path.exists()}")
    print(f"   Current working directory: {os.getcwd()}")
    # Try to read the file directly as a fallback
    if env_path.exists():
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.splitlines()
                for line in lines:
                    line = line.strip()
                    # Remove UTF-8 BOM if present
                    if line.startswith('\ufeff'):
                        line = line[1:]
                    if line.startswith('DATABASE_URL='):
                        db_value = line.split('=', 1)[1].strip()
                        os.environ['DATABASE_URL'] = db_value
                        print("[OK] Manually loaded DATABASE_URL from file")
                        database_url = db_value
                        break
        except Exception as e:
            print(f"[ERROR] Error reading .env file: {e}")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key or groq_api_key == "your_groq_api_key_here":
    print("WARNING: GROQ_API_KEY not set. Chat feature will not work.")
    print("   Get your API key from: https://console.groq.com")
    print("   Update services/vanna/.env with your GROQ_API_KEY")
    groq_client = None
else:
    groq_client = Groq(api_key=groq_api_key)

# Database connection
def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        # Try loading again in case it wasn't loaded at startup
        script_dir = Path(__file__).parent
        env_path = script_dir / '.env'
        load_dotenv(dotenv_path=env_path, override=True)
        database_url = os.getenv("DATABASE_URL")
    
    # If still not found, manually read from file as fallback
    if not database_url:
        script_dir = Path(__file__).parent
        env_path = script_dir / '.env'
        if env_path.exists():
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.splitlines()
                    for line in lines:
                        line = line.strip()
                        # Remove UTF-8 BOM if present
                        if line.startswith('\ufeff'):
                            line = line[1:]
                        # Skip empty lines and comments
                        if not line or line.startswith('#'):
                            continue
                        if line.startswith('DATABASE_URL='):
                            db_value = line.split('=', 1)[1].strip()
                            # Remove quotes if present
                            if db_value.startswith('"') and db_value.endswith('"'):
                                db_value = db_value[1:-1]
                            elif db_value.startswith("'") and db_value.endswith("'"):
                                db_value = db_value[1:-1]
                            os.environ['DATABASE_URL'] = db_value
                            database_url = db_value
                            print(f"[OK] Manually loaded DATABASE_URL from .env file (length: {len(db_value)})")
                            break
                if not database_url:
                    print(f"[WARNING] DATABASE_URL line not found in .env file")
            except Exception as e:
                print(f"[ERROR] Error reading .env file: {e}")
                import traceback
                traceback.print_exc()
    
    if not database_url:
        raise ValueError(
            f"DATABASE_URL environment variable is not set. "
            f"Please check your .env file at: {Path(__file__).parent / '.env'}"
        )
    
    # Remove postgresql+psycopg:// prefix if present (for SQLAlchemy format)
    if database_url.startswith("postgresql+psycopg://"):
        database_url = database_url.replace("postgresql+psycopg://", "postgresql://", 1)
    
    return psycopg2.connect(database_url)

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    sql: str
    results: list
    explanation: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_data(request: ChatRequest):
    if not groq_client:
        raise HTTPException(
            status_code=503,
            detail="Groq API key not configured. Please set GROQ_API_KEY in .env file. Get your key from https://console.groq.com"
        )
    try:
        # Get database schema information
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get table schemas
        cursor.execute("""
            SELECT table_name, column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position
        """)
        schema_info = cursor.fetchall()
        
        # Format schema for LLM
        schema_text = "\n".join([
            f"Table: {row['table_name']}, Column: {row['column_name']}, Type: {row['data_type']}"
            for row in schema_info
        ])
        
        # Generate SQL using Groq
        system_prompt = f"""You are a SQL expert. Given a database schema and a natural language query, generate a PostgreSQL SQL query.

Database Schema:
{schema_text}

Important Notes:
- Column names in PostgreSQL may be in camelCase (e.g., "dueDate", "issueDate", "vendorId", "invoiceNumber") or snake_case
- For date comparisons, use CURRENT_DATE for today's date
- For "overdue invoices", check: "dueDate" < CURRENT_DATE AND "status" != 'paid'
- For "pending invoices", check: "status" = 'pending'
- Use proper PostgreSQL date functions: CURRENT_DATE, CURRENT_TIMESTAMP, NOW()
- Join tables using proper foreign keys (e.g., invoices."vendorId" = vendors.id)
- When joining, use double quotes for camelCase column names: "vendorId", "dueDate", "issueDate", "invoiceNumber"
- For aggregations, use SUM() for totals, COUNT() for counts
- Use GROUP BY when using aggregate functions
- Use ORDER BY ... DESC for sorting descending, LIMIT for limiting results

Example Queries:
1. "List top 5 vendors by spend":
   SELECT v.name, SUM(i.total) as total_spend
   FROM vendors v
   JOIN invoices i ON i."vendorId" = v.id
   GROUP BY v.id, v.name
   ORDER BY total_spend DESC
   LIMIT 5;

2. "Show overdue invoices":
   SELECT i."invoiceNumber", v.name, i."dueDate", i.total
   FROM invoices i
   JOIN vendors v ON v.id = i."vendorId"
   WHERE i."dueDate" < CURRENT_DATE AND i.status != 'paid'
   ORDER BY i."dueDate" ASC;

3. "What's the total spend in the last 90 days":
   SELECT SUM(total) as total_spend
   FROM invoices
   WHERE "issueDate" >= CURRENT_DATE - INTERVAL '90 days';

Rules:
1. Only generate SELECT queries
2. Use proper PostgreSQL syntax
3. Return only the SQL query, no explanations or markdown
4. Use exact table names from schema: invoices, vendors, line_items, payments, categories
5. Use double quotes for camelCase column names (e.g., "vendorId", "dueDate", "issueDate")
6. Be precise and efficient
7. For date comparisons, always use CURRENT_DATE or CURRENT_TIMESTAMP appropriately
8. Always include proper JOINs when querying related tables"""

        user_prompt = f"Generate a SQL query for: {request.query}"

        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant",  # Updated: replaced decommissioned llama3-8b-8192
            temperature=0.1,
        )
        
        sql_query = chat_completion.choices[0].message.content.strip()
        print(f"[DEBUG] Generated SQL (raw): {sql_query}")
        
        # Remove markdown code blocks if present
        if sql_query.startswith("```"):
            sql_query = sql_query.split("```")[1]
            if sql_query.startswith("sql"):
                sql_query = sql_query[3:].strip()
            elif sql_query.startswith("postgresql"):
                sql_query = sql_query[9:].strip()
            sql_query = sql_query.strip()
        
        # Additional cleanup - remove any remaining markdown
        sql_query = sql_query.strip().rstrip('`').strip()
        
        print(f"[DEBUG] Cleaned SQL: {sql_query}")
        
        # Validate SQL query starts with SELECT
        if not sql_query.upper().startswith("SELECT"):
            raise HTTPException(
                status_code=400,
                detail=f"Generated query is not a SELECT statement: {sql_query}"
            )
        
        # Execute SQL query
        try:
            print(f"[DEBUG] Executing SQL: {sql_query}")
            cursor.execute(sql_query)
            results = cursor.fetchall()
            
            # Convert to list of dicts
            results_list = [dict(row) for row in results]
            print(f"[DEBUG] Query returned {len(results_list)} rows")
            
            # Generate explanation
            explanation_prompt = f"Explain what this SQL query does in simple terms: {sql_query}"
            explanation_completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "user", "content": explanation_prompt}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3,
            )
            explanation = explanation_completion.choices[0].message.content.strip()
            
        except Exception as e:
            cursor.close()
            conn.close()
            error_msg = str(e)
            print(f"[ERROR] SQL execution failed: {error_msg}")
            print(f"[ERROR] SQL query was: {sql_query}")
            raise HTTPException(
                status_code=400, 
                detail=f"SQL execution error: {error_msg}. Generated SQL: {sql_query}"
            )
        
        cursor.close()
        conn.close()
        
        return ChatResponse(
            sql=sql_query,
            results=results_list,
            explanation=explanation
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the full error for debugging
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Unexpected error in chat_with_data: {str(e)}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing query: {str(e)}"
        )

@app.post("/api/chat/stream")
async def chat_with_data_stream(request: ChatRequest):
    """Streaming version of chat endpoint using Server-Sent Events"""
    if not groq_client:
        async def error_stream():
            yield f"data: {json.dumps({'type': 'error', 'message': 'Groq API key not configured'})}\n\n"
        return StreamingResponse(error_stream(), media_type="text/event-stream")
    
    async def generate_stream():
        try:
            # Step 1: Get database schema
            yield f"data: {json.dumps({'type': 'status', 'message': 'Connecting to database...'})}\n\n"
            conn = get_db_connection()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            yield f"data: {json.dumps({'type': 'status', 'message': 'Reading database schema...'})}\n\n"
            cursor.execute("""
                SELECT table_name, column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public'
                ORDER BY table_name, ordinal_position
            """)
            schema_info = cursor.fetchall()
            
            schema_text = "\n".join([
                f"Table: {row['table_name']}, Column: {row['column_name']}, Type: {row['data_type']}"
                for row in schema_info
            ])
            
            # Step 2: Generate SQL
            yield f"data: {json.dumps({'type': 'status', 'message': 'Generating SQL query...'})}\n\n"
            
            system_prompt = f"""You are a SQL expert. Given a database schema and a natural language query, generate a PostgreSQL SQL query.

Database Schema:
{schema_text}

Important Notes:
- Column names in PostgreSQL may be in camelCase (e.g., "dueDate", "issueDate", "vendorId", "invoiceNumber") or snake_case
- For date comparisons, use CURRENT_DATE for today's date
- For "overdue invoices", check: "dueDate" < CURRENT_DATE AND "status" != 'paid'
- For "pending invoices", check: "status" = 'pending'
- Use proper PostgreSQL date functions: CURRENT_DATE, CURRENT_TIMESTAMP, NOW()
- Join tables using proper foreign keys (e.g., invoices."vendorId" = vendors.id)
- When joining, use double quotes for camelCase column names: "vendorId", "dueDate", "issueDate", "invoiceNumber"
- For aggregations, use SUM() for totals, COUNT() for counts
- Use GROUP BY when using aggregate functions
- Use ORDER BY ... DESC for sorting descending, LIMIT for limiting results

Example Queries:
1. "List top 5 vendors by spend":
   SELECT v.name, SUM(i.total) as total_spend
   FROM vendors v
   JOIN invoices i ON i."vendorId" = v.id
   GROUP BY v.id, v.name
   ORDER BY total_spend DESC
   LIMIT 5;

2. "Show overdue invoices":
   SELECT i."invoiceNumber", v.name, i."dueDate", i.total
   FROM invoices i
   JOIN vendors v ON v.id = i."vendorId"
   WHERE i."dueDate" < CURRENT_DATE AND i.status != 'paid'
   ORDER BY i."dueDate" ASC;

3. "What's the total spend in the last 90 days":
   SELECT SUM(total) as total_spend
   FROM invoices
   WHERE "issueDate" >= CURRENT_DATE - INTERVAL '90 days';

Rules:
1. Only generate SELECT queries
2. Use proper PostgreSQL syntax
3. Return only the SQL query, no explanations or markdown
4. Use exact table names from schema: invoices, vendors, line_items, payments, categories
5. Use double quotes for camelCase column names (e.g., "vendorId", "dueDate", "issueDate")
6. Be precise and efficient
7. For date comparisons, always use CURRENT_DATE or CURRENT_TIMESTAMP appropriately
8. Always include proper JOINs when querying related tables"""

            user_prompt = f"Generate a SQL query for: {request.query}"
            
            # Stream SQL generation from Groq
            stream = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.1,
                stream=True,
            )
            
            sql_query = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    sql_query += chunk.choices[0].delta.content
                    # Stream SQL as it's being generated
                    yield f"data: {json.dumps({'type': 'sql_chunk', 'chunk': chunk.choices[0].delta.content})}\n\n"
            
            sql_query = sql_query.strip()
            
            # Clean up SQL
            if sql_query.startswith("```"):
                sql_query = sql_query.split("```")[1]
                if sql_query.startswith("sql"):
                    sql_query = sql_query[3:].strip()
                elif sql_query.startswith("postgresql"):
                    sql_query = sql_query[9:].strip()
                sql_query = sql_query.strip()
            
            sql_query = sql_query.strip().rstrip('`').strip()
            
            # Send final SQL
            yield f"data: {json.dumps({'type': 'sql', 'sql': sql_query})}\n\n"
            
            # Validate SQL
            if not sql_query.upper().startswith("SELECT"):
                raise HTTPException(
                    status_code=400,
                    detail=f"Generated query is not a SELECT statement: {sql_query}"
                )
            
            # Step 3: Execute SQL
            yield f"data: {json.dumps({'type': 'status', 'message': 'Executing SQL query...'})}\n\n"
            
            try:
                cursor.execute(sql_query)
                results = cursor.fetchall()
                results_list = [dict(row) for row in results]
                
                yield f"data: {json.dumps({'type': 'status', 'message': f'Query returned {len(results_list)} rows'})}\n\n"
                
                # Step 4: Generate explanation
                yield f"data: {json.dumps({'type': 'status', 'message': 'Generating explanation...'})}\n\n"
                
                explanation_prompt = f"Explain what this SQL query does in simple terms: {sql_query}"
                explanation_completion = groq_client.chat.completions.create(
                    messages=[
                        {"role": "user", "content": explanation_prompt}
                    ],
                    model="llama-3.1-8b-instant",
                    temperature=0.3,
                )
                explanation = explanation_completion.choices[0].message.content.strip()
                
                # Send results
                yield f"data: {json.dumps({'type': 'results', 'results': results_list})}\n\n"
                
                # Send explanation
                yield f"data: {json.dumps({'type': 'explanation', 'explanation': explanation})}\n\n"
                
                # Send completion
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                
            except Exception as e:
                cursor.close()
                conn.close()
                error_msg = str(e)
                yield f"data: {json.dumps({'type': 'error', 'message': f'SQL execution error: {error_msg}', 'sql': sql_query})}\n\n"
                return
            
            cursor.close()
            conn.close()
            
        except HTTPException as e:
            yield f"data: {json.dumps({'type': 'error', 'message': e.detail})}\n\n"
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"[ERROR] Streaming error: {str(e)}")
            print(f"[ERROR] Traceback:\n{error_trace}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(generate_stream(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

