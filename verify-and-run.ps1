# Verify and Run Complete Project

Write-Host "`n🔍 Verifying Project Setup...`n" -ForegroundColor Cyan

# Check if .env files exist
$apiEnv = "apps\api\.env"
$webEnv = "apps\web\.env.local"

if (-not (Test-Path $apiEnv)) {
    Write-Host "⚠️  Warning: apps\api\.env not found" -ForegroundColor Yellow
} else {
    Write-Host "✅ Backend .env found" -ForegroundColor Green
}

if (-not (Test-Path $webEnv)) {
    Write-Host "⚠️  Warning: apps\web\.env.local not found (optional)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Frontend .env.local found" -ForegroundColor Green
}

# Check database connection
Write-Host "`n🔍 Testing database connection...`n" -ForegroundColor Cyan
Set-Location apps\api
$dbTest = npx prisma db pull 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database connection successful`n" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection failed`n" -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL in apps\api\.env`n" -ForegroundColor Yellow
    Set-Location ..\..
    exit 1
}

Set-Location ..\..

# Check if data exists
Write-Host "🔍 Checking database data...`n" -ForegroundColor Cyan
Set-Location apps\api
$vendorCount = node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.vendor.count().then(c => { console.log(c); p.`$disconnect(); });" 2>&1
if ($vendorCount -match "^\d+$" -and [int]$vendorCount -gt 0) {
    Write-Host "✅ Database has data ($vendorCount vendors found)`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: No vendors found in database" -ForegroundColor Yellow
    Write-Host "Run: cd apps\api && npx tsx prisma\seed.ts`n" -ForegroundColor Yellow
}
Set-Location ..\..

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ PROJECT VERIFICATION COMPLETE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "🚀 Ready to Run! Use these commands:`n" -ForegroundColor Cyan

Write-Host "Terminal 1 - Backend API:" -ForegroundColor Yellow
Write-Host "  cd apps\api" -ForegroundColor White
Write-Host "  npm run dev`n" -ForegroundColor White

Write-Host "Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd apps\web" -ForegroundColor White
Write-Host "  npm run dev`n" -ForegroundColor White

Write-Host "Then visit: http://localhost:3000`n" -ForegroundColor Green

