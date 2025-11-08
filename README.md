# Flowbit Analytics Dashboard

A production-grade full-stack web application featuring an interactive analytics dashboard and "Chat with Data" interface powered by Vanna AI and Groq.

## 🏗️ Architecture

This is a monorepo built with Turborepo containing:

- **apps/web**: Next.js frontend with shadcn/ui
- **apps/api**: Express.js backend API
- **services/vanna**: Python FastAPI service for AI-powered SQL generation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Docker (optional, for local PostgreSQL)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL:**
   ```bash
   # Using Docker Compose
   docker-compose up -d
   
   # Or use your own PostgreSQL instance
   ```

3. **Configure environment variables:**
   ```bash
   # Copy example env files
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   cp services/vanna/.env.example services/vanna/.env
   ```

4. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Vanna AI service:**
   ```bash
   cd services/vanna
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

6. **Start development servers:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express.js backend
├── services/
│   └── vanna/        # Python FastAPI Vanna AI service
├── data/
│   └── Analytics_Test_Data.json
└── package.json
```

## 🔌 API Endpoints

- `GET /api/stats` - Overview card metrics
- `GET /api/invoice-trends` - Monthly invoice trends
- `GET /api/vendors/top10` - Top 10 vendors by spend
- `GET /api/category-spend` - Spending by category
- `GET /api/cash-outflow` - Cash outflow forecast
- `GET /api/invoices` - Invoice list with filters
- `POST /api/chat-with-data` - Natural language query endpoint

## 🗄️ Database Schema

See `apps/api/prisma/schema.prisma` for the complete schema.

Main entities:
- **invoices**: Invoice records
- **vendors**: Vendor information
- **line_items**: Invoice line items
- **payments**: Payment records
- **categories**: Spending categories

## 🤖 Chat with Data

The "Chat with Data" feature uses Vanna AI to convert natural language queries into SQL and execute them against the PostgreSQL database.

Workflow:
1. User submits query in frontend
2. Frontend sends to `/api/chat-with-data`
3. Backend proxies to Vanna AI service
4. Vanna AI generates SQL using Groq
5. SQL is executed on PostgreSQL
6. Results are returned and displayed

## 📝 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [GitHub & Vercel Setup](./GITHUB_VERCEL_SETUP.md)
- [Detailed Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🚢 Deployment

- **Frontend/Backend**: Deploy to Vercel
- **Vanna AI**: Deploy to Render/Railway/Fly.io
- **Database**: Use managed PostgreSQL (Supabase, Neon, etc.)

See [Deployment Guide](./docs/DEPLOYMENT.md) or [GitHub & Vercel Setup](./GITHUB_VERCEL_SETUP.md) for detailed instructions.
