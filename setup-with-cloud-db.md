# Quick Setup with Cloud Database (Recommended)

This is the **fastest way** to get your data loaded!

## Step 1: Get Free Database (2 minutes)

### Option A: Supabase (Recommended)
1. Go to https://supabase.com
2. Sign up (free)
3. Click "New Project"
4. Fill in:
   - Name: `flowbit-analytics`
   - Database Password: `flowbit123` (or your choice)
   - Region: Choose closest to you
5. Wait 2 minutes for setup
6. Go to **Settings** → **Database**
7. Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Option B: Neon (Alternative)
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy the connection string

## Step 2: Update Environment File

Open `apps/api/.env` and replace the DATABASE_URL:

```env
DATABASE_URL="your_connection_string_from_supabase_or_neon"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
VANNA_API_BASE_URL=http://localhost:8000
```

**Important**: Make sure the connection string includes your password!

## Step 3: Run Setup Commands

```powershell
cd apps\api
npx prisma migrate dev --name init
npx tsx prisma\seed.ts
```

## Step 4: Verify

```powershell
npx prisma studio
```

You should see your Phunix GmbH invoice plus 50 sample invoices!

## That's It! 🎉

Your data is now loaded and ready to use!

