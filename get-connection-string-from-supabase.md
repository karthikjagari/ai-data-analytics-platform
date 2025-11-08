# Get Correct Connection String from Supabase

## Step-by-Step Guide

### Method 1: Get Connection String from Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `dlpxzssrtsnvqddynsta`

2. **Navigate to Database Settings**
   - Click **Settings** (gear icon, bottom left sidebar)
   - Click **"Database"** in the settings menu

3. **Get Connection String**
   - Scroll down to **"Connection string"** section
   - You'll see tabs: **URI**, **JDBC**, etc.
   - Click the **"URI"** tab
   - You'll see connection strings for different modes:
     - **Session mode** (Direct connection) - Use this one
     - **Transaction mode** (Pooler)
   
4. **Copy the Session Mode Connection String**
   - It should look like:
     ```
     postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - OR for direct connection:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
     ```

5. **Important**: The connection string from Supabase should already have your password included, OR it will show `[YOUR-PASSWORD]` which you need to replace.

### Method 2: Reset Password and Get Fresh String

1. **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **"Database password"** section
3. Click **"Reset database password"**
4. **Set a new password** (use only letters and numbers to avoid encoding issues)
   - Example: `MySecurePass123`
5. **Copy the connection string** that appears after reset
   - It will have your new password already included
6. **Update `apps/api/.env`** with the new connection string

### Method 3: Manual Construction

If you know your password is `n624UIjwOdGqPkVY` (without brackets):

```env
DATABASE_URL="postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

If your password actually has brackets `[n624UIjwOdGqPkVY]`:

```env
DATABASE_URL="postgresql://postgres:%5Bn624UIjwOdGqPkVY%5D@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

## Verify Your .env File

Make sure `apps/api/.env` has:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
VANNA_API_BASE_URL=http://localhost:8000
```

**Check:**
- ✅ Password is between `postgres:` and `@`
- ✅ No brackets `[]` around password (unless URL-encoded)
- ✅ Entire string is wrapped in quotes `"`
- ✅ No extra spaces

## Test After Updating

```powershell
cd apps\api
npx prisma db pull
```

If successful: `✔ Introspected database`

