# Database Setup Instructions

## Step 1: Create Environment File

Create `apps/api/.env` with the following content:

```env
DATABASE_URL="postgresql://flowbit:flowbit123@localhost:5432/flowbit_analytics?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
VANNA_API_BASE_URL=http://localhost:8000
```

**Important**: Update `DATABASE_URL` with your actual PostgreSQL connection string if you're using a different database.

## Step 2: Start PostgreSQL Database

### Option A: Using Docker (if installed)
```bash
docker compose up -d
```

### Option B: Using Local PostgreSQL
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE flowbit_analytics;
CREATE USER flowbit WITH PASSWORD 'flowbit123';
GRANT ALL PRIVILEGES ON DATABASE flowbit_analytics TO flowbit;
```

## Step 3: Run Migrations and Seed Data

From the project root:
```bash
cd apps/api
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

Or use the npm scripts from root:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Step 4: Verify Data

Check that your data was loaded:
```bash
cd apps/api
npx prisma studio
```

This will open a browser where you can see all your invoices, vendors, and related data.

## Your Data

The seed script will:
1. Load your invoice from `data/Analytics_Test_Data.json` (Phunix GmbH)
2. Generate 50 additional sample invoices for better dashboard visualization
3. Create all vendors, invoices, line items, and payments

Your actual data will be preserved and appear in the database!

