# Troubleshooting: No Data in Frontend

## Quick Checklist

### 1. ✅ Check if API Server is Running

The API server should be running on **port 3001**. Check:

```powershell
# Check if port 3001 is in use
netstat -ano | findstr :3001
```

**If not running**, start it:
```powershell
cd apps/api
npm run dev
```

You should see: `Server running on port 3001`

### 2. ✅ Check if Frontend is Running

The frontend should be running on **port 3000**. Check:

```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000
```

**If not running**, start it:
```powershell
cd apps/web
npm run dev
```

Or from root:
```powershell
npm run dev
```

### 3. ✅ Check Environment Variables

The API needs `DATABASE_URL` to connect to the database.

**Create `.env` file in `apps/api/`:**

```env
DATABASE_URL="your_supabase_connection_string"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Create `.env.local` file in `apps/web/` (optional):**

```env
NEXT_PUBLIC_API_BASE="http://localhost:3001/api"
```

### 4. ✅ Check Database Connection

Test if the database is accessible:

```powershell
cd apps/api
npx prisma db pull
```

If this fails, your `DATABASE_URL` is incorrect.

### 5. ✅ Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for errors
- **Network tab**: Check if API calls are failing
  - Look for requests to `/api/stats` or `http://localhost:3001/api/stats`
  - Check if they return errors (red status codes)

### 6. ✅ Test API Directly

Open in browser: `http://localhost:3001/health`

Should return: `{"status":"ok","timestamp":"..."}`

Then try: `http://localhost:3001/api/stats`

Should return JSON data or an error message.

## Common Issues

### Issue 1: "Failed to fetch" or Network Errors

**Cause**: API server not running or CORS issue

**Fix**:
1. Make sure API is running on port 3001
2. Check `FRONTEND_URL` in API `.env` matches your frontend URL

### Issue 2: "Database connection error"

**Cause**: Wrong `DATABASE_URL` or database not accessible

**Fix**:
1. Verify your Supabase connection string
2. Make sure database allows connections
3. Test connection: `npx prisma db pull`

### Issue 3: "404 Not Found" on API calls

**Cause**: API routes not set up correctly

**Fix**:
1. Check `apps/api/src/server.ts` has all routes
2. Make sure API is running
3. Check Next.js rewrites in `apps/web/next.config.js`

### Issue 4: Empty data (no errors, but no data)

**Cause**: Database is empty or queries return no results

**Fix**:
1. Check if database has data:
   ```powershell
   cd apps/api
   npx prisma studio
   ```
2. If empty, seed the database:
   ```powershell
   npm run db:seed
   ```

## Step-by-Step Fix

1. **Start API Server:**
   ```powershell
   cd apps/api
   # Make sure .env file exists with DATABASE_URL
   npm run dev
   ```

2. **Start Frontend:**
   ```powershell
   cd apps/web
   npm run dev
   ```

3. **Test API Health:**
   - Open: http://localhost:3001/health
   - Should see: `{"status":"ok"}`

4. **Test API Endpoint:**
   - Open: http://localhost:3001/api/stats
   - Should see JSON data or error message

5. **Check Frontend:**
   - Open: http://localhost:3000
   - Open DevTools (F12) → Network tab
   - Look for `/api/stats` request
   - Check if it succeeds (200) or fails (error)

6. **Check Console:**
   - Open DevTools (F12) → Console tab
   - Look for any error messages

## Quick Test Commands

```powershell
# Test if API is responding
curl http://localhost:3001/health

# Test stats endpoint
curl http://localhost:3001/api/stats

# Check if processes are running
netstat -ano | findstr ":3000 :3001"
```

## Still Not Working?

1. Check all terminal windows for error messages
2. Share the error messages from:
   - API server terminal
   - Frontend terminal  
   - Browser console (F12)
   - Browser network tab (F12 → Network)
