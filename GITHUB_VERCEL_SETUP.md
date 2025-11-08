# Quick Setup: GitHub & Vercel

Follow these steps to push your code to GitHub and deploy to Vercel.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `flowbit-analytics` (or your choice)
3. Description: "Analytics dashboard with AI-powered chat"
4. Choose Public or Private
5. **DO NOT** check "Add a README file" (we already have one)
6. Click **"Create repository"**

## Step 2: Connect and Push to GitHub

After creating the repository, run these commands in your project directory:

```powershell
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Flowbit Analytics project"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/flowbit-analytics.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You'll be prompted for your GitHub username and password/token.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find your `flowbit-analytics` repository and click **"Import"**
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `apps/web/.next` (change this!)
   - **Install Command**: `npm install` (auto-detected)

5. **IMPORTANT**: Add Environment Variables:
   - Click **"Environment Variables"**
   - Add: `DATABASE_URL` = your Supabase connection string
   - Add: `NEXT_PUBLIC_API_BASE` = `https://your-project-name.vercel.app/api` (update after first deploy)

6. Click **"Deploy"**

7. Wait for deployment (2-5 minutes)

8. Once deployed, copy your deployment URL and update `NEXT_PUBLIC_API_BASE` in Vercel settings

## Step 4: Update Environment Variables

After first deployment:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_BASE` with your actual Vercel URL
3. Go to **Deployments** → Click **"Redeploy"** on latest deployment

## Troubleshooting

- **Build fails?** Check Vercel build logs
- **API not working?** Verify `NEXT_PUBLIC_API_BASE` is correct
- **Database errors?** Check `DATABASE_URL` format and Supabase settings

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

