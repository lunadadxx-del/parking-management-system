@echo off
echo Starting Parking Management System...
echo.

echo Step 1: Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo Backend dependencies installation failed.
    pause
    exit /b 1
)

echo Step 2: Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo Frontend dependencies installation failed.
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Starting backend server (port 5000)...
start cmd /k "node server/index.js"

echo Step 4: Starting frontend development server (port 3000)...
timeout /t 3 /nobreak > nul
cd client
start cmd /k "npm run dev"

echo.
echo ============================================
echo Parking System is starting up!
echo ============================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open the frontend in browser...
pause > nul
start http://localhost:3000