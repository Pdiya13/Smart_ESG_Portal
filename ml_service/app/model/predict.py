import os
import pickle
import numpy as np

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")

class ModelWrapper:
    def __init__(self):
        self.model = None

    def load_model(self):
        """Loads the pre-trained Global model into memory."""
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Run train.py first.")
        
        with open(MODEL_PATH, "rb") as f:
            self.model = pickle.load(f)

    def predict(self, years: list[int], scores: list[float]) -> tuple[int, float]:
        """
        Uses the loaded model to predict the next year's score based on the input years and scores.
        Validates that we have at least 3 historical points.
        It uses the *last 3* historical scores to make the auto-regressive prediction.
        """
        if self.model is None:
            raise RuntimeError("Model is not loaded. Ensure load_model() is called on app startup.")

        # Take the last 3 scores to use as features for the next year
        last_3_scores = scores[-3:]
        
        X_input = np.array([last_3_scores])
        
        # Predict the next score using the pre-trained model
        prediction = self.model.predict(X_input)[0]
        
        # Determine the next year
        target_year = max(years) + 1
        
        return target_year, float(prediction)

# Singleton instance exported for use in the app
model_wrapper = ModelWrapper()
