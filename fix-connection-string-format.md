# Fix Connection String Format

## Current Error
The DATABASE_URL must start with `postgresql://` or `postgres://`

## Correct Format

Your `apps/api/.env` file should have:

```env
DATABASE_URL="postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

## Common Mistakes

### ❌ Wrong - Missing Protocol
```env
DATABASE_URL="db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

### ❌ Wrong - Missing postgres://
```env
DATABASE_URL="postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

### ✅ Correct
```env
DATABASE_URL="postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

## Connection String Structure

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

For your Supabase project:
- **Protocol**: `postgresql://` (required!)
- **User**: `postgres`
- **Password**: `n624UIjwOdGqPkVY`
- **Host**: `db.dlpxzssrtsnvqddynsta.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`

## Update Your .env File

1. Open `apps/api/.env`
2. Make sure the DATABASE_URL line starts with `postgresql://`
3. Full line should be:
   ```env
   DATABASE_URL="postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
   ```
4. Save the file
5. Test again:
   ```powershell
   cd apps\api
   npx prisma db pull
   ```

## Alternative: Use Pooler Connection

If direct connection doesn't work, try the pooler (port 6543):

```env
DATABASE_URL="postgresql://postgres.dlpxzssrtsnvqddynsta:n624UIjwOdGqPkVY@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

Replace `[REGION]` with your actual region (e.g., `us-east-1`).

