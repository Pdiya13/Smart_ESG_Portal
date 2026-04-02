# Startup script for Smart ESG Portal ML Service
# This script activates the virtual environment and starts the FastAPI server

$VENV_PATH = ".venv"

if (-not (Test-Path $VENV_PATH)) {
    Write-Host "Virtual environment not found at $VENV_PATH. Please run 'python -m venv .venv' first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting ML Service..." -ForegroundColor Cyan

# Use the python executable from the venv to run uvicorn
& ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000
