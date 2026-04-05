#!/bin/bash

echo "🔹 Activating virtual environment..."
source .venv/bin/activate
echo "🔹 Starting ML Prediction Service..."

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
