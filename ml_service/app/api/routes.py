from fastapi import APIRouter, HTTPException
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.services.prediction_service import evaluate_esg_prediction
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/predict",
    response_model=PredictionResponse,
    description="Predicts the next year's ESG score based on at least the last 3 years of data using a Linear Regression model.",
    status_code=200
)
async def predict_esg_score(request: PredictionRequest):
    logger.info("Received request to /predict endpoint.")
    try:
        response = evaluate_esg_prediction(request)
        return response
    except Exception as e:
        logger.error(f"Failed to generate prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", status_code=200, summary="Health check endpoint for Eureka")
async def health_check():
    """Endpoint consumed by Eureka Server to ensure ML Service is available."""
    return {"status": "UP"}
