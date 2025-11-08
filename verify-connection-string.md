# Verify Your Connection String

## Current Connection String Format

Your connection string should be in this format:

```
postgresql://postgres:[YOUR-PASSWORD]@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
```

## Common Issues

### Issue 1: Password Not Replaced
Make sure `[YOUR-PASSWORD]` is replaced with your actual password.

**Wrong:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
```

**Correct:**
```
postgresql://postgres:MyActualPassword123@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
```

### Issue 2: Special Characters in Password
If your password has special characters, they need to be URL-encoded:

**Special characters that need encoding:**
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

**Example:**
If your password is `MyPass!123`, it should be:
```
postgresql://postgres:MyPass%21123@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
```

### Issue 3: Extra Quotes or Spaces
Make sure there are no extra quotes or spaces:

**Wrong:**
```
DATABASE_URL="postgresql://postgres:password@db... "
DATABASE_URL='postgresql://postgres:password@db...'
```

**Correct:**
```
DATABASE_URL="postgresql://postgres:password@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

## Quick Fix: Get Fresh Connection String

1. Go to **Supabase Dashboard**
2. Click **Settings** (gear icon)
3. Click **Database**
4. Scroll to **"Connection string"**
5. Make sure you're on the **"URI"** tab
6. Look for **"Direct connection"** or **"Session mode"**
7. Click the **copy icon** to copy the full string
8. It should already have your password included
9. Paste it directly into `apps/api/.env` as:
   ```
   DATABASE_URL="[paste the entire connection string here]"
   ```

## Test Your Connection String

After updating, test with:
```powershell
cd apps\api
npx prisma db pull
```

If successful, you'll see: `✔ Introspected database`

## Alternative: Reset Password

If you're still having issues:

1. **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **"Database password"**
3. Click **"Reset database password"**
4. Set a simple password (letters and numbers only, no special characters)
   - Example: `MySecurePass123`
5. Copy the new connection string
6. Update `apps/api/.env`

This avoids any URL-encoding issues!

