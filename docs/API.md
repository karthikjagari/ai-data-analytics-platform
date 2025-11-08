# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-app.vercel.app/api`

## Endpoints

### GET /stats
Returns overview statistics for the dashboard cards.

**Response:**
```json
{
  "totalSpendYTD": 12679.25,
  "totalSpendChange": 8.2,
  "totalInvoices": 64,
  "totalInvoicesChange": 8.2,
  "documentsThisMonth": 17,
  "documentsChange": -8,
  "averageInvoiceValue": 2455.00,
  "averageInvoiceValueChange": 8.2
}
```

### GET /invoice-trends
Returns monthly invoice trends for the last 12 months.

**Response:**
```json
[
  {
    "month": "Jan",
    "invoiceCount": 5,
    "totalSpend": 10000
  },
  ...
]
```

### GET /vendors/top10
Returns top 10 vendors by total spend.

**Response:**
```json
[
  {
    "id": "vendor-id",
    "name": "Phunix GmbH",
    "totalSpend": 8679.25,
    "invoiceCount": 19,
    "percentage": 68.4,
    "cumulativePercentage": 68.4
  },
  ...
]
```

### GET /category-spend
Returns spending grouped by category.

**Response:**
```json
[
  {
    "name": "Operations",
    "total": 1000
  },
  {
    "name": "Marketing",
    "total": 7250
  }
]
```

### GET /cash-outflow
Returns expected cash outflow by date range.

**Response:**
```json
{
  "0-7 days": 1000,
  "8-30 days": 5000,
  "31-60 days": 3000,
  "60+ days": 15000
}
```

### GET /invoices
Returns paginated list of invoices with optional filters.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string)
- `status` (string: "paid", "pending", "overdue")
- `vendorId` (string)
- `sortBy` (string, default: "issueDate")
- `sortOrder` (string: "asc" | "desc", default: "desc")

**Response:**
```json
{
  "invoices": [
    {
      "id": "invoice-id",
      "invoiceNumber": "INV-2025-001",
      "vendor": "Phunix GmbH",
      "vendorId": "vendor-id",
      "customerName": "Acme Corporation",
      "issueDate": "2025-01-15T00:00:00.000Z",
      "dueDate": "2025-02-15T00:00:00.000Z",
      "status": "pending",
      "total": 5950.00,
      "currency": "EUR"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 64,
    "totalPages": 2
  }
}
```

### POST /chat-with-data
Processes natural language queries and returns SQL + results.

**Request:**
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response:**
```json
{
  "sql": "SELECT SUM(total) FROM invoices WHERE issue_date >= NOW() - INTERVAL '90 days'",
  "results": [
    {
      "sum": 12345.67
    }
  ],
  "explanation": "This query calculates the total amount spent on invoices in the last 90 days."
}
```

