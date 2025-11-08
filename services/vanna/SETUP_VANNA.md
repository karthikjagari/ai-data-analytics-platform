# Setup Vanna AI Service

## ✅ Dependencies Installed

All Python dependencies have been installed successfully, including:
- ✅ fastapi
- ✅ uvicorn
- ✅ psycopg2-binary
- ✅ groq
- ✅ pydantic
- ✅ python-dotenv

## 🔑 Get Groq API Key

1. **Go to Groq Console**: https://console.groq.com
2. **Sign up** or **Log in**
3. **Create API Key**:
   - Go to API Keys section
   - Click "Create API Key"
   - Copy the key (starts with `gsk_...`)

## ⚙️ Configure Environment

Update `services/vanna/.env`:

```env
DATABASE_URL=postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
GROQ_API_KEY=gsk_your_actual_api_key_here
PORT=8000
```

**Important**: Replace `your_groq_api_key_here` with your actual Groq API key!

## 🚀 Start Vanna AI Service

```powershell
cd services\vanna
.\venv\Scripts\activate
python main.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## ✅ Verify It's Working

1. **Health Check**: http://localhost:8000/health
   - Should return: `{"status":"ok"}`

2. **Test Chat Endpoint** (from backend):
   ```powershell
   curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" -d "{\"query\": \"What's the total spend?\"}"
   ```

## 🔗 Integration

Once Vanna AI is running:
- Backend will proxy chat requests to http://localhost:8000
- Frontend "Chat with Data" feature will work
- Users can ask natural language questions about the data

## ⚠️ Without Groq API Key

If you don't have a Groq API key yet:
- The Chat with Data feature won't work
- But the rest of the dashboard will function normally
- You can still view all charts and data

## 📝 Quick Start Commands

```powershell
# Navigate to Vanna directory
cd services\vanna

# Activate virtual environment
.\venv\Scripts\activate

# Update .env with your Groq API key
# (Edit services\vanna\.env file)

# Start the service
python main.py
```

The service will run on http://localhost:8000

