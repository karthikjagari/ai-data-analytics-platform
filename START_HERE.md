# 🚀 START HERE - Load Your Data

## Current Status
✅ Project is ready
✅ Your data file: `data/Analytics_Test_Data.json` (Phunix GmbH invoice)
✅ Seed script configured
✅ Environment file created

## ⚡ FASTEST WAY (5 minutes)

### Step 1: Get Free Database
1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up (free)
3. Click **"New Project"**
4. Fill in:
   - **Name**: `flowbit-analytics`
   - **Database Password**: Choose a password (remember it!)
   - **Region**: Choose closest to you
5. Wait 2 minutes for setup

### Step 2: Get Connection String
1. In your Supabase project, go to **Settings** (gear icon)
2. Click **Database**
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string
   - It looks like: `postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - **Important**: Replace `[YOUR-PASSWORD]` with the password you set!

### Step 3: Update Environment File
Open `apps/api/.env` and replace the DATABASE_URL line:

```env
DATABASE_URL="postgresql://postgres.[ref]:YOUR_PASSWORD@aws-0-[region].pooler.supabase.com:6543/postgres"
```

**Make sure to replace `YOUR_PASSWORD` with your actual password!**

### Step 4: Load Your Data
Run these commands in PowerShell:

```powershell
cd apps\api
npx prisma migrate dev --name init
npx tsx prisma\seed.ts
```

### Step 5: Verify
```powershell
npx prisma studio
```

You should see:
- ✅ Your Phunix GmbH invoice
- ✅ 50 additional sample invoices
- ✅ Multiple vendors and categories

## 🎉 That's It!

Your data is loaded! Now start the app:

**Terminal 1:**
```powershell
cd apps\api
npm run dev
```

**Terminal 2:**
```powershell
cd apps\web
npm run dev
```

Visit **http://localhost:3000** to see your dashboard! 🚀

## 📝 What Gets Loaded

- ✅ **Your actual data**: Phunix GmbH invoice (€5,950.00) from `Analytics_Test_Data.json`
- ✅ **Sample data**: 50 invoices with:
  - 6 different vendors
  - 6 categories (Operations, Marketing, Facilities, IT, HR, Sales)
  - Spread across last 12 months
  - Various statuses (pending, paid, overdue)

## ❓ Need Help?

- See `QUICK_START.md` for detailed instructions
- See `PROCEED.md` for alternative database options
- Check `README.md` for full documentation

