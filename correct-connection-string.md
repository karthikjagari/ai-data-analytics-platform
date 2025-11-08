# Correct Connection String

## Your Password Options

### Option 1: Password WITHOUT brackets
If your password is: `n624UIjwOdGqPkVY` (no brackets)

**Connection string:**
```env
DATABASE_URL="postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

### Option 2: Password WITH brackets (needs encoding)
If your password is: `[n624UIjwOdGqPkVY]` (with brackets)

**URL-encoded password:** `%5Bn624UIjwOdGqPkVY%5D`
- `[` → `%5B`
- `]` → `%5D`

**Connection string:**
```env
DATABASE_URL="postgresql://postgres:%5Bn624UIjwOdGqPkVY%5D@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

## Update apps/api/.env

1. Open `apps/api/.env`
2. Replace the DATABASE_URL line with one of the above (depending on which password you have)
3. Save the file
4. Test:
   ```powershell
   cd apps\api
   npx prisma db pull
   ```

## Alternative: Get Fresh Connection String from Supabase

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Make sure you're on **"URI"** tab
4. Copy the **entire** connection string
5. It should already have your password correctly formatted
6. Paste it into `apps/api/.env`

This is the easiest way - Supabase will give you the correctly formatted string!

