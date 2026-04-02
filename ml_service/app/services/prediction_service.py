import logging
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.model.predict import model_wrapper

logger = logging.getLogger(__name__)

def evaluate_esg_prediction(request: PredictionRequest) -> PredictionResponse:
    """
    Takes the prediction request, validates the sizes, and returns the response from the model.
    """
    logger.info(f"Evaluating ESG score for years: {request.years} with scores: {request.scores}")
    try:
        predicted_year, predicted_score = model_wrapper.predict(request.years, request.scores)
        logger.info(f"Predicted year {predicted_year} with score {predicted_score}")
        
        return PredictionResponse(
            predicted_year=predicted_year,
            predicted_score=predicted_score
        )
    except Exception as e:
        logger.error(f"Error during ML prediction: {e}")
        raise
