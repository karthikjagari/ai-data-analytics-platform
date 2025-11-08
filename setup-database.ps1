# Database Setup Script for Windows PowerShell

Write-Host "🚀 Setting up database with your data..." -ForegroundColor Green

# Check if .env exists
$envPath = "apps\api\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "⚠️  Creating .env file..." -ForegroundColor Yellow
    @"
DATABASE_URL="postgresql://flowbit:flowbit123@localhost:5432/flowbit_analytics?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
VANNA_API_BASE_URL=http://localhost:8000
"@ | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ Created $envPath" -ForegroundColor Green
    Write-Host "📝 Please update DATABASE_URL if you're using a different PostgreSQL instance" -ForegroundColor Cyan
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Generate Prisma Client
Write-Host "`n📦 Generating Prisma Client..." -ForegroundColor Green
Set-Location apps\api
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

# Run migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Green
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed. Please check your DATABASE_URL and ensure PostgreSQL is running." -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

# Seed database
Write-Host "`n🌱 Seeding database with your data..." -ForegroundColor Green
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..

Write-Host "`n✨ Database setup complete!" -ForegroundColor Green
Write-Host "Your data from Analytics_Test_Data.json has been loaded." -ForegroundColor Cyan
Write-Host "Run npx prisma studio in apps/api to view your data." -ForegroundColor Cyan

