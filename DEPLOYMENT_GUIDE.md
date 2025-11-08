# GitHub & Vercel Deployment Guide

This guide will walk you through connecting your project to GitHub and deploying it to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Git installed on your machine
- Node.js 18+ installed

---

## Part 1: Connect to GitHub

### Step 1: Initialize Git Repository

If you haven't already, initialize git in your project:

```bash
git init
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `flowbit-analytics` (or your preferred name)
   - **Description**: "Analytics dashboard with AI-powered chat"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 3: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your project directory:

```bash
# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Flowbit Analytics project"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/flowbit-analytics.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/flowbit-analytics.git
```

### Step 4: Verify GitHub Connection

1. Go to your GitHub repository page
2. You should see all your project files
3. Your code is now on GitHub! 🎉

---

## Part 2: Deploy to Vercel

### Step 1: Sign Up / Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended for easy integration)

### Step 2: Import Your GitHub Repository

1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click **"Import"** next to your `flowbit-analytics` repository
4. If you don't see it, click **"Adjust GitHub App Permissions"** and grant access

### Step 3: Configure Project Settings

Vercel will auto-detect your project settings. Verify:

1. **Framework Preset**: Should be "Next.js" (auto-detected)
2. **Root Directory**: Leave as `./` (root)
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### Step 4: Configure Environment Variables

**IMPORTANT**: Before deploying, add your environment variables:

1. In the Vercel project settings, go to **"Environment Variables"**
2. Add the following variables (click **"Add"** for each):

#### Required Environment Variables:

```
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_API_BASE=https://your-api-domain.vercel.app/api
```

#### Optional Environment Variables (if needed):

```
NODE_ENV=production
```

**For the API Base URL:**
- Initially, you can use: `https://your-project-name.vercel.app/api`
- After deploying, update it to your actual API URL

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-project-name.vercel.app`

### Step 6: Deploy API Separately (If Separate)

If your API is in a separate service, you may need to:

1. Create a separate Vercel project for the API
2. Or configure Vercel to handle both frontend and API routes
3. Update `NEXT_PUBLIC_API_BASE` to point to your API URL

---

## Part 3: Post-Deployment Configuration

### Update Environment Variables

After deployment, update your environment variables if needed:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_BASE` with your actual API URL
4. Redeploy if needed

### Database Configuration

Make sure your Supabase database:
- Allows connections from Vercel's IP addresses
- Has the correct connection string format
- Is accessible from the internet (not just localhost)

### Test Your Deployment

1. Visit your Vercel URL
2. Test all major features:
   - Login/Authentication
   - Dashboard
   - Chat functionality
   - File uploads
   - Department management

---

## Part 4: Continuous Deployment

### Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy when you push to `main` branch (production)
- Create preview deployments for pull requests
- Rebuild on every commit

### Manual Deployments

You can also trigger manual deployments:
1. Go to Vercel dashboard
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on any deployment

---

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies
   - Database connection issues

### API Not Working

1. Verify `NEXT_PUBLIC_API_BASE` is set correctly
2. Check CORS settings in your API
3. Ensure API routes are properly configured

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Supabase connection settings
3. Ensure database allows external connections

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Configure environment variables
4. ✅ Test deployment
5. ✅ Set up custom domain (optional)
6. ✅ Configure monitoring and analytics (optional)

---

## Quick Reference Commands

```bash
# Git commands
git add .
git commit -m "Your commit message"
git push origin main

# Check git status
git status

# View git log
git log --oneline

# Pull latest changes
git pull origin main
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review GitHub Actions (if configured)
3. Check environment variables
4. Verify database connectivity
5. Review Next.js build output

Good luck with your deployment! 🚀

