# Quick Fix: No Data in Frontend

## The Problem
- API server is running but returning 500 errors
- This means **DATABASE_URL is missing or incorrect**

## Solution

### Step 1: Create `.env` file in `apps/api/`

Create a file: `apps/api/.env` with:

```env
DATABASE_URL="your_supabase_connection_string_here"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Get your DATABASE_URL from Supabase:**
1. Go to your Supabase project
2. Settings → Database
3. Connection String → Connection Pooling
4. Copy the connection string
5. It should look like: `postgresql://user:password@host:port/database?sslmode=require`

### Step 2: Restart API Server

1. Stop the current API server (Ctrl+C in the terminal)
2. Start it again:
   ```powershell
   cd apps/api
   npm run dev
   ```

### Step 3: Test

1. Open browser: http://localhost:3001/health
   - Should show: `{"status":"ok","timestamp":"..."}`

2. Open browser: http://localhost:3001/api/stats
   - Should show JSON data (even if empty array)
   - If still 500 error, DATABASE_URL is wrong

### Step 4: Check Frontend

1. Open: http://localhost:3000
2. Open DevTools (F12) → Console tab
3. Look for errors
4. Check Network tab → Look for `/api/stats` request

## If Database is Empty

If API works but shows empty data, seed the database:

```powershell
cd apps/api
npm run db:seed
```

## Still Not Working?

Check the API server terminal for error messages. Common errors:

- `Can't reach database server` → DATABASE_URL is wrong
- `Authentication failed` → Password in DATABASE_URL is wrong
- `Database does not exist` → Database name in DATABASE_URL is wrong

