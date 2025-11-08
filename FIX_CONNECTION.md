# 🔧 Fix Database Connection

## Current Issue: Authentication Failed

This usually means the password in your connection string needs to be URL-encoded.

## Solution

### Option 1: URL-Encode Your Password

If your password has special characters (like `!`, `@`, `#`, `$`, etc.), they need to be URL-encoded in the connection string.

**Common special character encodings:**
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `*` → `%2A`
- `(` → `%28`
- `)` → `%29`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `[` → `%5B`
- `]` → `%5D`

### Option 2: Use Direct Connection (Recommended)

Instead of the pooler connection, use the **direct connection** string from Supabase:

1. Go to Supabase Dashboard
2. Settings → Database
3. Scroll to **"Connection string"**
4. Look for **"Direct connection"** or **"Session mode"**
5. Copy that connection string instead

It should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Option 3: Reset Database Password

If you're not sure about the password:

1. Go to Supabase Dashboard
2. Settings → Database
3. Scroll to **"Database password"**
4. Click **"Reset database password"**
5. Set a new password (use only letters and numbers to avoid encoding issues)
6. Update your `.env` file with the new connection string

### Quick Fix Script

You can also use this PowerShell command to URL-encode your password:

```powershell
[System.Web.HttpUtility]::UrlEncode("YOUR_PASSWORD_HERE")
```

Then replace `[YOUR-PASSWORD]` in the connection string with the encoded version.

## After Fixing

1. Update `apps/api/.env` with the corrected connection string
2. Test connection:
   ```powershell
   cd apps\api
   npx prisma db pull
   ```
3. If successful, proceed with migrations and seeding

