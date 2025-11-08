# Test and Fix Database Connection

Write-Host "`n🔍 Testing Database Connection...`n" -ForegroundColor Cyan

Set-Location apps\api

# Try to connect
Write-Host "Attempting to connect to database..." -ForegroundColor Yellow
$result = npx prisma db pull 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCCESS! Database connection works!`n" -ForegroundColor Green
    Write-Host "You can now proceed with migrations and seeding." -ForegroundColor Cyan
    Set-Location ..\..
    exit 0
}

Write-Host "`n❌ Connection failed!`n" -ForegroundColor Red

# Check what error we got
if ($result -match "Authentication failed") {
    Write-Host "🔐 Authentication Error Detected`n" -ForegroundColor Yellow
    Write-Host "This usually means:" -ForegroundColor Cyan
    Write-Host "  1. Password in connection string is incorrect" -ForegroundColor White
    Write-Host "  2. Password has special characters that need URL-encoding" -ForegroundColor White
    Write-Host "  3. Connection string format is wrong`n" -ForegroundColor White
    
    Write-Host "💡 Solutions:" -ForegroundColor Cyan
    Write-Host "`nOption 1: Use Direct Connection String" -ForegroundColor Yellow
    Write-Host "  - Go to Supabase Dashboard → Settings → Database" -ForegroundColor White
    Write-Host "  - Find 'Direct connection' or 'Session mode'" -ForegroundColor White
    Write-Host "  - Copy that connection string" -ForegroundColor White
    Write-Host "  - Make sure password is correct`n" -ForegroundColor White
    
    Write-Host "Option 2: URL-Encode Password" -ForegroundColor Yellow
    Write-Host "  If password has special characters (!@#\$ etc.), encode them:" -ForegroundColor White
    Write-Host "  ! = %21, @ = %40, # = %23, \$ = %24" -ForegroundColor Gray
    Write-Host "  Or use PowerShell: [System.Web.HttpUtility]::UrlEncode('YOUR_PASSWORD')`n" -ForegroundColor Gray
    
    Write-Host "Option 3: Reset Password (Easiest)" -ForegroundColor Yellow
    Write-Host "  - Supabase Dashboard → Settings → Database" -ForegroundColor White
    Write-Host "  - Click 'Reset database password'" -ForegroundColor White
    Write-Host "  - Use only letters and numbers (no special chars)" -ForegroundColor White
    Write-Host "  - Update apps\api\.env with new connection string`n" -ForegroundColor White
}

Write-Host "📖 See FIX_CONNECTION.md for detailed instructions`n" -ForegroundColor Cyan

Set-Location ..\..

