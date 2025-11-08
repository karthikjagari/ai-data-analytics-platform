# Project Structure

```
flowbit-analytics/
├── apps/
│   ├── api/                    # Express.js Backend API
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Database seeding script
│   │   ├── src/
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── stats.ts
│   │   │   │   ├── invoice-trends.ts
│   │   │   │   ├── vendors.ts
│   │   │   │   ├── category-spend.ts
│   │   │   │   ├── cash-outflow.ts
│   │   │   │   ├── invoices.ts
│   │   │   │   └── chat-with-data.ts
│   │   │   ├── lib/
│   │   │   │   └── prisma.ts   # Prisma client instance
│   │   │   └── server.ts       # Express server setup
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx     # Dashboard page
│       │   │   ├── chat/
│       │   │   │   └── page.tsx # Chat with Data page
│       │   │   ├── api/         # Next.js API routes (proxy)
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   ├── ui/          # shadcn/ui components
│       │   │   ├── charts/      # Chart components
│       │   │   ├── sidebar.tsx
│       │   │   ├── header.tsx
│       │   │   ├── overview-card.tsx
│       │   │   └── invoices-table.tsx
│       │   └── lib/
│       │       └── utils.ts     # Utility functions
│       ├── package.json
│       └── next.config.js
│
├── services/
│   └── vanna/                   # Python FastAPI Vanna AI Service
│       ├── main.py              # FastAPI application
│       ├── requirements.txt     # Python dependencies
│       └── README.md
│
├── data/
│   └── Analytics_Test_Data.json # Sample data file
│
├── docs/
│   ├── API.md                   # API documentation
│   ├── DATABASE.md              # Database schema docs
│   └── DEPLOYMENT.md            # Deployment guide
│
├── docker-compose.yml           # PostgreSQL Docker setup
├── package.json                 # Root package.json (workspaces)
├── turbo.json                   # Turborepo configuration
├── README.md                    # Main README
├── SETUP.md                     # Setup instructions
└── PROJECT_STRUCTURE.md        # This file
```

## Key Files

### Backend (`apps/api`)
- **`src/server.ts`**: Express server with all route registrations
- **`prisma/schema.prisma`**: Database schema definition
- **`prisma/seed.ts`**: Data seeding script

### Frontend (`apps/web`)
- **`src/app/page.tsx`**: Main dashboard page
- **`src/app/chat/page.tsx`**: Chat with Data interface
- **`src/components/`**: Reusable React components

### Vanna AI (`services/vanna`)
- **`main.py`**: FastAPI application with Groq integration

## Data Flow

1. **Dashboard**: Frontend → Backend API → PostgreSQL
2. **Chat with Data**: Frontend → Backend API → Vanna AI → Groq → SQL → PostgreSQL → Results

## Environment Variables

See `.env.example` files in each app/service directory for required variables.

