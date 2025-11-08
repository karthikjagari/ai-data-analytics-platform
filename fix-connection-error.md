# Fix "Can't Reach Database Server" Error

## Current Error: P1001
The connection string format looks correct, but Prisma can't reach the database.

## Common Causes & Solutions

### 1. Database is Paused (Most Common)

Supabase free tier pauses databases after inactivity.

**Fix:**
1. Go to **Supabase Dashboard**
2. Check if your project shows "Paused" or "Resume" button
3. Click **"Resume"** or **"Restore"** to wake up the database
4. Wait 1-2 minutes for it to start
5. Try connecting again

### 2. Wrong Connection String Type

Make sure you're using the **Direct Connection** (not Pooler).

**Check:**
1. Supabase Dashboard → Settings → Database
2. Scroll to **"Connection string"**
3. Make sure you're using:
   - ✅ **"Direct connection"** or **"Session mode"**
   - ❌ NOT "Transaction mode" or "Pooler"

**Direct connection format:**
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Pooler format (won't work for migrations):**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-xx.pooler.supabase.com:6543/postgres
```

### 3. Firewall/Network Issue

If you're on a corporate network or VPN, it might be blocking the connection.

**Try:**
- Disconnect VPN temporarily
- Try from a different network
- Check if port 5432 is blocked

### 4. Connection String Format

Make sure your `.env` file has the correct format:

**Correct:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

**Wrong:**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
# Missing quotes

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres "
# Extra space at end
```

## Quick Fix Steps

1. **Check if database is paused:**
   - Go to Supabase Dashboard
   - If paused, click "Resume"
   - Wait 2 minutes

2. **Get fresh connection string:**
   - Settings → Database → Connection string
   - Use **"Direct connection"** (URI tab)
   - Copy the entire string
   - Update `apps/api/.env`

3. **Test connection:**
   ```powershell
   cd apps\api
   npx prisma db pull
   ```

## Alternative: Use Connection Pooling (For Production)

If direct connection doesn't work, you can try the pooler, but you'll need to adjust the connection string format. However, for migrations, direct connection is recommended.

## Still Not Working?

1. Verify your Supabase project is active (not deleted)
2. Check your internet connection
3. Try creating a new Supabase project
4. Make sure you're using the correct region

