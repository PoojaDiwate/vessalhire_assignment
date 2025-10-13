Write-Host "Starting Vessel Hire Dashboard..." -ForegroundColor Green
Write-Host ""

# Start React dev server in background
Write-Host "Starting React development server..." -ForegroundColor Yellow
$reactJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

# Wait for React to start
Start-Sleep -Seconds 3

# Start Django server (this will block)
Write-Host "Starting Django development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Access your application at: http://localhost:8000/" -ForegroundColor Cyan
Write-Host "Press CTRL+C to stop both servers" -ForegroundColor Gray
Write-Host ""

try {
    python manage.py runserver
} finally {
    # Clean up React server when Django stops
    Write-Host ""
    Write-Host "Stopping React server..." -ForegroundColor Yellow
    Stop-Job -Job $reactJob
    Remove-Job -Job $reactJob
    Write-Host "All servers stopped." -ForegroundColor Green
}

