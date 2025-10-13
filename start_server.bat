@echo off
echo Starting Vessel Hire Dashboard...
echo.

REM Start React dev server in a new window
echo Starting React development server...
start /B cmd /c "npm run dev > nul 2>&1"

REM Wait for React to start
timeout /t 3 /nobreak > nul

REM Start Django server
echo Starting Django development server...
python manage.py runserver

REM If Django stops, kill React server
taskkill /F /IM node.exe > nul 2>&1

