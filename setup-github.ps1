# GitHub Setup Script
# This script helps you push your project to GitHub

Write-Host "=== GitHub Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Show current status
Write-Host "Current git status:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor Yellow
Write-Host "   Go to: https://github.com/new" -ForegroundColor White
Write-Host ""
Write-Host "2. After creating the repository, run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Initial commit: Flowbit Analytics project'" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Replace YOUR_USERNAME and REPO_NAME with your actual GitHub details" -ForegroundColor Yellow
Write-Host ""
Write-Host "For detailed instructions, see GITHUB_VERCEL_SETUP.md" -ForegroundColor Cyan

