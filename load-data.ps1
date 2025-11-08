# Load Data Script - Automates database setup and data loading

Write-Host "`n🚀 Flowbit Analytics - Data Loading Script" -ForegroundColor Green
Write-Host "==========================================`n" -ForegroundColor Green

# Check if .env exists
$envPath = "apps\api\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env file not found at $envPath" -ForegroundColor Red
    Write-Host "Please create it first. See READY_TO_LOAD.md for instructions." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found .env file" -ForegroundColor Green

# Check database connection
Write-Host "`n🔍 Checking database connection..." -ForegroundColor Cyan
Set-Location apps\api

try {
    npx prisma db pull --force 2>&1 | Out-Null
    $dbConnected = $?
} catch {
    $dbConnected = $false
}

if (-not $dbConnected) {
    Write-Host "`n⚠️  Cannot connect to database!" -ForegroundColor Yellow
    Write-Host "`n📋 Quick Setup Options:" -ForegroundColor Cyan
    Write-Host "`n1. SUPABASE (Recommended - Free, 5 min):" -ForegroundColor White
    Write-Host "   - Go to: https://supabase.com" -ForegroundColor Gray
    Write-Host "   - Sign up → New Project" -ForegroundColor Gray
    Write-Host "   - Copy connection string from Settings → Database" -ForegroundColor Gray
    Write-Host "   - Update apps\api\.env with: DATABASE_URL=`"your_connection_string`"" -ForegroundColor Gray
    Write-Host "   - Then run this script again" -ForegroundColor Gray
    
    Write-Host "`n2. DOCKER (If installed):" -ForegroundColor White
    Write-Host "   - Run: docker compose up -d" -ForegroundColor Gray
    Write-Host "   - Then run this script again" -ForegroundColor Gray
    
    Write-Host "`n3. LOCAL POSTGRESQL:" -ForegroundColor White
    Write-Host "   - Install PostgreSQL" -ForegroundColor Gray
    Write-Host "   - Create database: CREATE DATABASE flowbit_analytics;" -ForegroundColor Gray
    Write-Host "   - Update apps\api\.env if needed" -ForegroundColor Gray
    Write-Host "   - Then run this script again" -ForegroundColor Gray
    
    Set-Location ..\..
    exit 1
}

Write-Host "✅ Database connection successful!" -ForegroundColor Green

# Generate Prisma Client
Write-Host "`n📦 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

# Run migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}
Write-Host "✅ Migrations completed" -ForegroundColor Green

# Seed database
Write-Host "`n🌱 Loading your data from Analytics_Test_Data.json..." -ForegroundColor Cyan
Write-Host "   (This will also generate sample data for better visualization)`n" -ForegroundColor Gray

npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Seeding failed" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..

Write-Host "`n✨ SUCCESS! Your data has been loaded!" -ForegroundColor Green
Write-Host "`n📊 Your data includes:" -ForegroundColor Cyan
Write-Host "   - Your Phunix GmbH invoice from Analytics_Test_Data.json" -ForegroundColor White
Write-Host "   - 50 additional sample invoices for dashboard visualization" -ForegroundColor White
Write-Host "   - Multiple vendors, categories, and payment records" -ForegroundColor White

Write-Host "`n🔍 View your data:" -ForegroundColor Cyan
Write-Host "   cd apps\api" -ForegroundColor White
Write-Host "   npx prisma studio" -ForegroundColor White

Write-Host "`n🚀 Start the application:" -ForegroundColor Cyan
Write-Host "   Terminal 1: cd apps\api && npm run dev" -ForegroundColor White
Write-Host "   Terminal 2: cd apps\web && npm run dev" -ForegroundColor White
Write-Host "   Then visit: http://localhost:3000" -ForegroundColor White

Write-Host "`n"

