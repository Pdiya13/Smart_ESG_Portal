import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.routes import router as ml_router
from app.discovery.eureka_client import register_eureka, deregister_eureka
from app.model.predict import model_wrapper
from app.core.config import settings
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Events
    logger.info("Initializing ML Service...")
    
    # Check if model exists, if not run the train script locally
    try:
        # We try to load it first
        model_wrapper.load_model()
        logger.info("Successfully loaded ML model from disk.")
    except FileNotFoundError:
        logger.warning("No pre-trained model found! Bootstrapping model offline now...")
        from app.model.train import train_and_save_model
        train_and_save_model()
        # Retry logic
        model_wrapper.load_model()
        logger.info("Successfully loaded dynamically bootstrapped ML model.")

    # Register into Eureka Service Registry asynchronously
    await register_eureka()

    yield # Let FastAPI handle requests

    # Shutdown Events
    logger.info("Shutting down ML Service...")
    await deregister_eureka()
    logger.info("Shutdown completed.")

app = FastAPI(
    title="ML Prediction Service",
    description="A Python FastAPI Microservice executing Machine Learning for ESG Data Prediction",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI enabled at /docs (default)
    lifespan=lifespan
)

# Include API Router under /ml sub-path
# Using prefix '/ml' means all endpoints in router will start with `/ml`.
# Ex: POST /ml/predict
app.include_router(ml_router, prefix="/ml", tags=["Machine Learning"])

# Because Eureka's health check usually hits `/health` (without prefix if we define it like that)
# we can explicitly mount a copy to root from the main app or include it without prefix. 
# But in routes.py, we have @router.get('/health'). That means it's available at `/ml/health`.
# Let's add a raw `/health` to the root so Eureka's default URL works as specified in `eureka_client.py`.
@app.get("/health", tags=["Health"])
async def root_health_check():
    return {"status": "UP"}
