# Test Database Connection Script

Write-Host "`n🔍 Testing Database Connection...`n" -ForegroundColor Cyan

$envPath = "apps\api\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env file not found at $envPath" -ForegroundColor Red
    Write-Host "Please create it first. See CONNECT_SUPABASE.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found .env file" -ForegroundColor Green

# Check if DATABASE_URL is set
$envContent = Get-Content $envPath -Raw
if ($envContent -notmatch 'DATABASE_URL=') {
    Write-Host "❌ DATABASE_URL not found in .env file" -ForegroundColor Red
    Write-Host "Please add your Supabase connection string. See CONNECT_SUPABASE.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ DATABASE_URL found in .env`n" -ForegroundColor Green

# Try to connect
Set-Location apps\api

Write-Host "Testing connection..." -ForegroundColor Cyan
$result = npx prisma db pull 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCCESS! Database connection works!`n" -ForegroundColor Green
    Write-Host "You can now proceed with:" -ForegroundColor Cyan
    Write-Host "  npx prisma migrate dev --name init" -ForegroundColor White
    Write-Host "  npx tsx prisma\seed.ts`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Connection failed!`n" -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Check your DATABASE_URL in apps\api\.env" -ForegroundColor White
    Write-Host "  2. Make sure you replaced [YOUR-PASSWORD] with your actual password" -ForegroundColor White
    Write-Host "  3. Verify your Supabase project is active" -ForegroundColor White
    Write-Host "  4. Check your internet connection`n" -ForegroundColor White
    Write-Host "See CONNECT_SUPABASE.md for detailed instructions`n" -ForegroundColor Cyan
}

Set-Location ..\..

