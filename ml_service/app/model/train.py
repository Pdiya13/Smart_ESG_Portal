import os
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")

def generate_training_data():
    """
    Generate dummy sequential data where the last 3 years' ESG scores
    predict the next year's score.
    X represents a window of 3 previous scores.
    y represents the target next score.
    """
    # Let's say ESG score naturally progresses with some logic.
    # [score_1, score_2, score_3] -> score_4
    X = np.array([
        [50, 55, 60],
        [55, 60, 65],
        [60, 65, 70],
        [65, 70, 75],
        [70, 75, 80],
        [75, 80, 85]
    ])
    y = np.array([65, 70, 75, 80, 85, 90])
    return X, y

def train_and_save_model():
    print("Generating simulated time-series training data...")
    X, y = generate_training_data()
    
    print("Training Autoregressive Linear Regression model (3-window)...")
    model = LinearRegression()
    model.fit(X, y)
    
    print(f"Saving model to {MODEL_PATH}...")
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
        
    print("Global model saved successfully!")
    
if __name__ == "__main__":
    train_and_save_model()
