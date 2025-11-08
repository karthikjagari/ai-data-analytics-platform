# Try Pooler Connection Instead

If direct connection isn't working, try the **Transaction Pooler** connection string.

## Steps

1. **Go to Supabase Dashboard**
   - Settings → Database
   - Scroll to "Connection string"

2. **Use Transaction Pooler (Port 6543)**
   - Look for "Transaction mode" or "Pooler"
   - Copy that connection string
   - It should look like:
     ```
     postgresql://postgres.dlpxzssrtsnvqddynsta:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```

3. **Update `apps/api/.env`**
   - Replace DATABASE_URL with the pooler connection string
   - Make sure password is correct

4. **Test Again**
   ```powershell
   cd apps\api
   npx prisma db pull
   ```

## Alternative: Check Database Status

1. **Supabase Dashboard**
   - Make sure project is **Active** (not paused)
   - Check project status in the dashboard

2. **Verify Connection String**
   - Make sure you copied the **entire** connection string
   - No missing parts
   - Password is included correctly

3. **Try Creating New Project**
   - If current project has issues
   - Create a fresh Supabase project
   - Use the new connection string

## Connection String Formats

**Direct Connection (Port 5432):**
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Pooler Connection (Port 6543):**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-xx.pooler.supabase.com:6543/postgres
```

Both should work, but try the pooler if direct doesn't.

