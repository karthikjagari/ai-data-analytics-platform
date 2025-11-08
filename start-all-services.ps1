# Start All Services Script
# This script starts Backend, Frontend, and Vanna AI services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\dontp\OneDrive\Attachments\Desktop\PROJECTS .... TRIALS\cloneeeee"

# Start Backend API
Write-Host "[1/3] Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\apps\api'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/3] Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\apps\web'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Vanna AI
Write-Host "[3/3] Starting Vanna AI Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\services\vanna'; .\venv\Scripts\activate; python main.py" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All services are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services will open in separate windows:" -ForegroundColor Cyan
Write-Host "  - Backend API:    http://localhost:3001" -ForegroundColor White
Write-Host "  - Frontend:       http://localhost:3000" -ForegroundColor White
Write-Host "  - Vanna AI:       http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Wait a few seconds for services to start, then visit:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Green
Write-Host ""

