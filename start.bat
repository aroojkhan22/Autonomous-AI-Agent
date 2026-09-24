@echo off
setlocal
cd /d "%~dp0"

echo Starting Autonomous AI Agent...
echo.

if not exist "backend\venv" (
  echo Creating Python virtual environment...
  python -m venv backend\venv
)

call backend\venv\Scripts\activate.bat
python -m pip install -r backend\requirements.txt

start "AI Agent API" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python -m uvicorn main:app --reload --port 8000"

cd frontend
if not exist node_modules (
  call npm install
)
start "AI Agent Frontend" cmd /k "npm run dev"

timeout /t 3 >nul
start http://localhost:5173
