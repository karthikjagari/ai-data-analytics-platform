# MCP Server Configuration

## Added Supabase MCP Server

I've created `.cursorrules` with your Supabase MCP configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=dlpxzssrtsnvqddynsta"
    }
  }
}
```

## Important Note

The MCP server is for AI-assisted database interactions, but **Prisma still needs the DATABASE_URL** in your `.env` file to connect directly.

## Next Steps

1. **Make sure your `.env` file has the correct DATABASE_URL:**
   - Open `apps/api/.env`
   - Ensure it has: `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres"`
   - Replace `YOUR_PASSWORD` with your actual password (or URL-encoded if it has special characters)

2. **Test the connection:**
   ```powershell
   cd apps\api
   npx prisma db pull
   ```

3. **If successful, proceed with migrations and seeding:**
   ```powershell
   npx prisma migrate dev --name init
   npx tsx prisma\seed.ts
   ```

## MCP vs Direct Connection

- **MCP Server**: For AI-assisted queries and interactions
- **DATABASE_URL**: Required for Prisma migrations, seeding, and direct database access

Both are needed for the full application to work!

