@echo off
REM Vessel Hire Application - Docker Startup Script for Windows
REM This script helps you start the application with Docker

echo 🚢 Starting Vessel Hire Application with Docker...
echo ==================================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [SUCCESS] Docker is running

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] docker-compose is not installed. Please install it and try again.
    pause
    exit /b 1
)

echo [SUCCESS] docker-compose is available

REM Stop any existing containers
echo [INFO] Stopping any existing containers...
docker-compose down --remove-orphans

REM Build and start services
echo [INFO] Building and starting services...
docker-compose up -d --build

REM Wait for services to be ready
echo [INFO] Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check service health
echo [INFO] Checking service health...

REM Check if services are responding
curl -f http://localhost/ >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Application is ready
) else (
    echo [WARNING] Application might still be starting up...
)

echo.
echo 🎉 Application startup completed!
echo ==================================================
echo.
echo 📱 Access the application:
echo    🌐 Frontend: http://localhost
echo    🔧 Backend API: http://localhost/api
echo    👨‍💼 Django Admin: http://localhost/admin
echo    🗄️  Database: localhost:1433
echo.
echo 🔑 Login credentials:
echo    👑 Admin: admin / admin123
echo    👤 User:  user / user123
echo.
echo 📊 Useful commands:
echo    📋 View logs: docker-compose logs -f
echo    🔄 Restart: docker-compose restart
echo    🛑 Stop: docker-compose down
echo    🧹 Clean up: docker-compose down -v
echo.
echo 🐛 Troubleshooting:
echo    If services are not ready, wait a few more minutes
echo    Check logs with: docker-compose logs [service_name]
echo    Common services: backend, frontend, db, nginx
echo.

REM Show running containers
echo [INFO] Running containers:
docker-compose ps

echo.
echo Press any key to exit...
pause >nul
