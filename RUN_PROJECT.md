# 🚀 How to Run Your Complete Project

## Quick Start (All Services)

### Option 1: Run Everything (Recommended)

**Terminal 1 - Backend API:**
```powershell
cd apps\api
npm run dev
```
Backend will run on: http://localhost:3001

**Terminal 2 - Frontend:**
```powershell
cd apps\web
npm run dev
```
Frontend will run on: http://localhost:3000

**Terminal 3 - Vanna AI (Optional, for Chat with Data):**
```powershell
cd services\vanna
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Vanna AI will run on: http://localhost:8000

### Option 2: Using npm workspaces (From Root)

From the project root directory:

```powershell
# Install all dependencies (if not done)
npm install

# Start all services (if configured)
npm run dev
```

## Step-by-Step Guide

### Prerequisites Check

✅ **Database**: Already connected to Supabase  
✅ **Data**: Already seeded (51 invoices loaded)  
✅ **Dependencies**: Should be installed

### Step 1: Start Backend API

Open **Terminal 1**:

```powershell
cd apps\api
npm run dev
```

**Expected output:**
```
🚀 API server running on port 3001
```

**Test it:**
- Health check: http://localhost:3001/health
- Stats API: http://localhost:3001/api/stats

### Step 2: Start Frontend

Open **Terminal 2** (new terminal window):

```powershell
cd apps\web
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
```

**Access dashboard:**
- Open browser: http://localhost:3000

### Step 3: Start Vanna AI (Optional - for Chat Feature)

Open **Terminal 3** (new terminal window):

```powershell
cd services\vanna

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the service
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Note:** You need:
- Python 3.10+ installed
- Groq API key in `services/vanna/.env`

## Complete Setup Checklist

### ✅ Already Done
- [x] Database connected to Supabase
- [x] Migrations applied
- [x] Data seeded (51 invoices)

### 🔄 To Start Now

1. **Backend API** (Terminal 1)
   ```powershell
   cd apps\api
   npm run dev
   ```

2. **Frontend** (Terminal 2)
   ```powershell
   cd apps\web
   npm run dev
   ```

3. **Vanna AI** (Terminal 3 - Optional)
   ```powershell
   cd services\vanna
   venv\Scripts\activate
   python main.py
   ```

## Access Points

Once all services are running:

- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Vanna AI**: http://localhost:8000 (if started)

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify database connection in `apps/api/.env`
- Check for errors in terminal

### Frontend won't start
- Check if port 3000 is available
- Verify `NEXT_PUBLIC_API_BASE` in `apps/web/.env.local`
- Make sure backend is running first

### Vanna AI won't start
- Check Python version: `python --version` (need 3.10+)
- Verify `GROQ_API_KEY` in `services/vanna/.env`
- Check if port 8000 is available

### Dashboard shows no data
- Verify backend is running on port 3001
- Check browser console for errors
- Verify API endpoints are accessible

## Quick Commands Reference

```powershell
# Backend
cd apps\api && npm run dev

# Frontend  
cd apps\web && npm run dev

# Vanna AI
cd services\vanna && venv\Scripts\activate && python main.py

# Database (view data)
cd apps\api && npx prisma studio
```

## What You'll See

### Dashboard (http://localhost:3000)
- ✅ Overview cards with metrics
- ✅ Invoice trends chart
- ✅ Vendor spend chart
- ✅ Category breakdown
- ✅ Cash outflow forecast
- ✅ Invoices table
- ✅ Chat with Data (if Vanna AI is running)

### API Endpoints (http://localhost:3001/api)
- `/stats` - Overview metrics
- `/invoice-trends` - Monthly trends
- `/vendors/top10` - Top vendors
- `/category-spend` - Category breakdown
- `/cash-outflow` - Cash forecast
- `/invoices` - Invoice list
- `/chat-with-data` - AI queries

## Environment Variables

Make sure these are set:

**Backend** (`apps/api/.env`):
```env
DATABASE_URL="your_supabase_connection_string"
PORT=3001
FRONTEND_URL=http://localhost:3000
VANNA_API_BASE_URL=http://localhost:8000
```

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Vanna AI** (`services/vanna/.env`):
```env
DATABASE_URL="your_supabase_connection_string"
GROQ_API_KEY=your_groq_api_key
PORT=8000
```

## Success Indicators

✅ **Backend running**: See "API server running on port 3001"  
✅ **Frontend running**: See "Local: http://localhost:3000"  
✅ **Dashboard loads**: See charts and data  
✅ **API works**: http://localhost:3001/api/stats returns JSON

## Next Steps After Starting

1. Open http://localhost:3000 in your browser
2. Explore the dashboard
3. Check the "Chat with Data" feature (if Vanna AI is running)
4. View your data in Prisma Studio: `cd apps\api && npx prisma studio`

Enjoy your Flowbit Analytics Dashboard! 🎉

