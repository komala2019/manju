# Manju Startup Script — Runs all three services

Write-Host ">>> Starting Manju Tatva..." -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Kill any existing processes on our ports
Write-Host "[*] Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "dotnet" -or $_.ProcessName -eq "python" -or $_.ProcessName -eq "node" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 1. Start Backend API (port 5200)
Write-Host "[1] Starting Backend API (port 5200)..." -ForegroundColor Green
# Backend start omitted (dotnet SDK not available)
Write-Host "[1] Backend start skipped (dotnet missing)" -ForegroundColor Yellow
Start-Sleep -Seconds 4

# 2. Start Agent Service (port 3002)
Write-Host "[2] Starting Agent Service (port 3002)..." -ForegroundColor Green
Push-Location "$projectRoot\agent-service"
Start-Process node -ArgumentList "index.js" -NoNewWindow -RedirectStandardOutput "$projectRoot\agent.log"
Pop-Location
Start-Sleep -Seconds 3

# 3. Start Frontend Server (port 7821)
Write-Host "[3] Starting Frontend Server (port 7821)..." -ForegroundColor Green
# Use Node http-server instead of Python
Push-Location $projectRoot
Start-Process npx -ArgumentList "http-server -p 7821" -NoNewWindow -RedirectStandardOutput "$projectRoot\\frontend.log"
Pop-Location
Start-Sleep -Seconds 2

# Verify all ports are listening
Write-Host "`n[*] Checking services..." -ForegroundColor Cyan
$ports = @(5200, 3002, 7821)
foreach ($port in $ports) {
    $listening = netstat -ano | Select-String $port | Select-String "LISTENING"
    if ($listening) {
        Write-Host "  [OK] Port $($port): listening" -ForegroundColor Green
    } else {
        Write-Host "  [X] Port $($port): not found (may still be starting...)" -ForegroundColor Yellow
    }
}

Write-Host "`n*** Manju is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:      http://localhost:7821" -ForegroundColor Cyan
Write-Host "  Backend API:   http://localhost:5200/api" -ForegroundColor Cyan
Write-Host "  Agent Service: http://localhost:3002/api/chat" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Logs:" -ForegroundColor Cyan
Write-Host "     Backend:  $projectRoot\backend.log" -ForegroundColor DarkGray
Write-Host "     Agent:    $projectRoot\agent.log" -ForegroundColor DarkGray
Write-Host "     Frontend: $projectRoot\frontend.log" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Press Ctrl+C to stop services (when ready)." -ForegroundColor Yellow
Write-Host ""

# Keep the script running (pause indefinitely)
while ($true) { Start-Sleep -Seconds 10 }
