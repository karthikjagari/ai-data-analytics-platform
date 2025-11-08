# 🔗 Connect to Supabase Database

## Step-by-Step Guide

### Step 1: Create Supabase Account (2 minutes)

1. **Go to Supabase**: https://supabase.com
2. Click **"Start your project"** (top right)
3. Sign up with:
   - GitHub (recommended - fastest)
   - Email
   - Or Google

### Step 2: Create New Project (2 minutes)

1. After signing in, click **"New Project"**
2. Fill in the form:
   - **Name**: `flowbit-analytics` (or any name you like)
   - **Database Password**: 
     - Choose a strong password
     - **IMPORTANT**: Save this password! You'll need it.
     - Example: `MySecurePass123!`
   - **Region**: Choose the closest to your location
     - US East, US West, EU West, etc.
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

### Step 3: Get Connection String (1 minute)

1. Once your project is ready, you'll see the dashboard
2. Click the **⚙️ Settings** icon (bottom left sidebar)
3. Click **"Database"** in the settings menu
4. Scroll down to **"Connection string"** section
5. You'll see tabs: **URI**, **JDBC**, **Golang**, etc.
6. Click the **"URI"** tab
7. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
8. **Copy this entire string**
9. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you set in Step 2!

### Step 4: Update Your .env File

1. Open `apps/api/.env` in your editor
2. Find the line: `DATABASE_URL="..."`
3. Replace it with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:YOUR_ACTUAL_PASSWORD@aws-0-[region].pooler.supabase.com:6543/postgres"
   ```
4. **Make sure to replace `YOUR_ACTUAL_PASSWORD` with your real password!**
5. Save the file

### Step 5: Test Connection

Run this command to test your connection:

```powershell
cd apps\api
npx prisma db pull
```

If it works, you'll see: `✔ Introspected database`

### Step 6: Load Your Data

Now run the setup commands:

```powershell
cd apps\api
npx prisma migrate dev --name init
npx tsx prisma\seed.ts
```

## 🎉 Success!

Your data will be loaded! You should see:
- ✅ Your Phunix GmbH invoice
- ✅ 50 sample invoices
- ✅ All vendors and categories

## 🔍 View Your Data

```powershell
cd apps\api
npx prisma studio
```

This opens a browser where you can see all your data!

## ❓ Troubleshooting

### "Can't reach database server"
- Check your connection string is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Verify your Supabase project is active (not paused)

### "Authentication failed"
- Double-check your password in the connection string
- Make sure there are no extra spaces or quotes

### "Connection timeout"
- Check your internet connection
- Verify the region in your connection string matches your project region

## 📝 Example Connection String Format

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Replace:
- `abcdefghijklmnop` = Your project reference (auto-generated)
- `[YOUR-PASSWORD]` = The password you set when creating the project
- `us-east-1` = Your project region

## 🚀 Next Steps After Connection

Once connected and data is loaded:

1. **Start Backend**:
   ```powershell
   cd apps\api
   npm run dev
   ```

2. **Start Frontend** (new terminal):
   ```powershell
   cd apps\web
   npm run dev
   ```

3. **Visit**: http://localhost:3000

