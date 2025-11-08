# Get Your Actual Database Password

## The Issue

`[PASSWORD]` is a **placeholder** - you need to replace it with your **actual Supabase database password**.

## How to Get Your Password

### Option 1: You Set It When Creating the Project

When you created your Supabase project, you set a database password. That's the password you need.

### Option 2: Reset the Password (Easiest)

1. **Go to Supabase Dashboard**
2. Click **Settings** (gear icon, bottom left)
3. Click **"Database"** in the settings menu
4. Scroll down to **"Database password"** section
5. Click **"Reset database password"**
6. **Set a new password** (remember it!)
   - Example: `MySecurePass123`
   - Use only letters and numbers to avoid encoding issues
7. **Copy the connection string** that appears
   - It will have your password already included
   - It looks like: `postgresql://postgres:MySecurePass123@db.xxxxx.supabase.co:5432/postgres`

### Option 3: Check Your Connection String

1. **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **"Connection string"**
3. The connection string shown should have your password
4. If it shows `[YOUR-PASSWORD]`, that's a placeholder - you need to replace it

## Update Your .env File

Once you have your actual password:

1. Open `apps/api/.env`
2. Find the line: `DATABASE_URL="..."`
3. Replace `[PASSWORD]` with your actual password

**Example:**
```env
# Before (WRONG):
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"

# After (CORRECT):
DATABASE_URL="postgresql://postgres:MySecurePass123@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

## Important Notes

- The password is the one you set when creating the Supabase project
- If you forgot it, just reset it (Option 2 above)
- The connection string from Supabase should already have the password included
- Make sure there are no spaces or extra characters

## After Updating

Test the connection:
```powershell
cd apps\api
npx prisma db pull
```

If successful, you'll see: `✔ Introspected database`

