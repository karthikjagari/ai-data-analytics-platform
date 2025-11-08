# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL 14+ (or Docker)
- Groq API key ([Get one here](https://console.groq.com))

## Step 1: Clone and Install

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspaces
```

## Step 2: Database Setup

### Option A: Docker (Recommended for local development)

```bash
# Start PostgreSQL
docker-compose up -d

# Verify it's running
docker ps
```

### Option B: Local PostgreSQL

Create a database:
```sql
CREATE DATABASE flowbit_analytics;
```

## Step 3: Configure Environment Variables

### Backend API (`apps/api/.env`)
```env
DATABASE_URL="postgresql://flowbit:flowbit123@localhost:5432/flowbit_analytics?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
VANNA_API_BASE_URL=http://localhost:8000
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vanna AI (`services/vanna/.env`)
```env
DATABASE_URL=postgresql://flowbit:flowbit123@localhost:5432/flowbit_analytics
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
```

## Step 4: Database Migration & Seeding

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

## Step 5: Start Services

### Terminal 1: Backend API
```bash
cd apps/api
npm run dev
```
Backend will run on http://localhost:3001

### Terminal 2: Vanna AI Service
```bash
cd services/vanna
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Vanna AI will run on http://localhost:8000

### Terminal 3: Frontend
```bash
cd apps/web
npm run dev
```
Frontend will run on http://localhost:3000

## Step 6: Verify Setup

1. **Database**: Check Prisma Studio
   ```bash
   cd apps/api
   npx prisma studio
   ```

2. **Backend**: Visit http://localhost:3001/health
   Should return: `{"status":"ok"}`

3. **Vanna AI**: Visit http://localhost:8000/health
   Should return: `{"status":"ok"}`

4. **Frontend**: Visit http://localhost:3000
   Dashboard should load with data

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `docker ps` or `pg_isready`
- Check DATABASE_URL format matches your setup
- Ensure database exists: `psql -U flowbit -d flowbit_analytics`

### Port Conflicts
- Backend (3001): Change in `apps/api/.env`
- Frontend (3000): Change in `apps/web/package.json`
- Vanna (8000): Change in `services/vanna/.env`

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules apps/*/node_modules
npm install
```

### Prisma Issues
```bash
# Reset database (WARNING: Deletes all data)
cd apps/api
npx prisma migrate reset
npm run db:seed
```

## Next Steps

- Add your actual data to `data/Analytics_Test_Data.json`
- Configure Groq API key in `services/vanna/.env`
- Customize dashboard styling to match your brand
- Set up deployment (see `docs/DEPLOYMENT.md`)

## Development Tips

- Use Prisma Studio to inspect database: `npx prisma studio`
- Check API logs in terminal running backend
- Check Vanna AI logs in terminal running Python service
- Use browser DevTools Network tab to debug API calls

