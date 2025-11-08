# Deployment Guide

## Overview
This application consists of three main components:
1. **Frontend** (Next.js) - Deploy to Vercel
2. **Backend API** (Express) - Deploy to Vercel or Railway
3. **Vanna AI Service** (Python FastAPI) - Deploy to Render/Railway/Fly.io

## Prerequisites
- GitHub account
- Vercel account
- Render/Railway account (for Vanna AI)
- PostgreSQL database (Supabase, Neon, or Railway)
- Groq API key

## Step 1: Database Setup

### Option A: Supabase (Recommended)
1. Create a new project on [Supabase](https://supabase.com)
2. Copy the connection string from Settings → Database
3. Update `DATABASE_URL` in your environment variables

### Option B: Neon
1. Create a new project on [Neon](https://neon.tech)
2. Copy the connection string
3. Update `DATABASE_URL`

### Option C: Railway
1. Create a new PostgreSQL service on [Railway](https://railway.app)
2. Copy the connection string
3. Update `DATABASE_URL`

## Step 2: Deploy Backend API

### Using Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Set root directory to `apps/api`
4. Configure environment variables:
   ```
   DATABASE_URL=postgresql://...
   PORT=3001
   FRONTEND_URL=https://your-frontend.vercel.app
   VANNA_API_BASE_URL=https://your-vanna.onrender.com
   ```
5. Deploy

### Using Railway
1. Create new project on Railway
2. Connect GitHub repository
3. Set root directory to `apps/api`
4. Add environment variables
5. Deploy

## Step 3: Deploy Frontend

1. Import project in Vercel
2. Set root directory to `apps/web`
3. Configure environment variables:
   ```
   NEXT_PUBLIC_API_BASE=https://your-api.vercel.app/api
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
4. Deploy

## Step 4: Deploy Vanna AI Service

### Using Render
1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Set:
   - **Root Directory**: `services/vanna`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
4. Configure environment variables:
   ```
   DATABASE_URL=postgresql://...
   GROQ_API_KEY=your_groq_api_key
   PORT=8000
   ```
5. Deploy

### Using Railway
1. Create new service
2. Set root directory to `services/vanna`
3. Add environment variables
4. Deploy

### Using Fly.io
1. Install Fly CLI
2. Create `fly.toml` in `services/vanna`:
   ```toml
   app = "your-vanna-app"
   primary_region = "iad"
   
   [build]
   
   [env]
     PORT = "8000"
   
   [[services]]
     internal_port = 8000
     protocol = "tcp"
   ```
3. Run `fly deploy`

## Step 5: Database Migration & Seeding

After deployment, run migrations:

```bash
# Locally or via CI/CD
cd apps/api
npx prisma migrate deploy
npx prisma db seed
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Step 6: Configure CORS

Update CORS settings in:
- **Backend**: `apps/api/src/server.ts` - Add your frontend URL
- **Vanna AI**: `services/vanna/main.py` - Update `allow_origins`

## Step 7: Environment Variables Summary

### Frontend (.env)
```
NEXT_PUBLIC_API_BASE=https://your-api.vercel.app/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
VANNA_API_BASE_URL=https://your-vanna.onrender.com
```

### Vanna AI (.env)
```
DATABASE_URL=postgresql://...
GROQ_API_KEY=your_groq_api_key
PORT=8000
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database allows connections from your deployment platform
- Ensure SSL is configured if required

### CORS Errors
- Verify `FRONTEND_URL` in backend matches actual frontend URL
- Check Vanna AI CORS settings

### API Not Found
- Verify `NEXT_PUBLIC_API_BASE` points to correct backend URL
- Check Vercel rewrites configuration

### Vanna AI Timeout
- Increase timeout settings on Render/Railway
- Check Groq API key is valid
- Verify database connection from Vanna service

## Monitoring

- **Vercel**: Check deployment logs and analytics
- **Render/Railway**: Monitor service logs
- **Database**: Use Supabase/Neon dashboard for query performance

## CI/CD (Optional)

Add GitHub Actions for automated deployments:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

