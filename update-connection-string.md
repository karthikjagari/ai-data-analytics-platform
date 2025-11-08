# Update Connection String with Your Password

## Your Information
- **Password**: `n624UIjwOdGqPkVY`
- **Project URL**: `https://dlpxzssrtsnvqddynsta.supabase.co`

## Connection String Format

Your connection string should be:

```
postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
```

## Update apps/api/.env

Open `apps/api/.env` and make sure the DATABASE_URL line looks like this:

```env
DATABASE_URL="postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"
```

**Important:**
- Make sure the password `n624UIjwOdGqPkVY` is between `postgres:` and `@`
- No brackets `[]` around the password
- The entire string is wrapped in quotes
- No extra spaces

## If Password Has Special Characters

If your password actually has brackets like `[n624UIjwOdGqPkVY]`, you need to URL-encode them:
- `[` → `%5B`
- `]` → `%5D`

So it would be: `%5Bn624UIjwOdGqPkVY%5D`

But based on your message, I'm assuming the password is `n624UIjwOdGqPkVY` without brackets.

## Test Connection

After updating, test with:
```powershell
cd apps\api
npx prisma db pull
```

