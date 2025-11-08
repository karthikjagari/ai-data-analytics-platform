# Vanna AI Service

FastAPI service for natural language to SQL conversion using Groq.

## Setup

1. Install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Run the service:
```bash
python main.py
```

The service will be available at `http://localhost:8000`

## API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Process natural language query

### Chat Request
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

### Chat Response
```json
{
  "sql": "SELECT SUM(total) FROM invoices WHERE issue_date >= NOW() - INTERVAL '90 days'",
  "results": [{"sum": 12345.67}],
  "explanation": "This query calculates the total amount spent on invoices in the last 90 days."
}
```

