from pydantic import BaseModel, Field, field_validator
from typing import List

class PredictionRequest(BaseModel):
    years: List[int] = Field(..., description="List of previous years (minimum 3)")
    scores: List[float] = Field(..., description="List of previous ESG scores corresponding to the years (minimum 3)")

    @field_validator('years')
    def validate_years(cls, v: List[int]) -> List[int]:
        if len(v) < 3:
            raise ValueError("Minimum 3 years required for prediction")
        
        # Ensure sequential years
        sorted_years = sorted(v)
        if v != sorted_years:
            raise ValueError("Years must be sorted in ascending order")
            
        for i in range(1, len(v)):
            if v[i] != v[i-1] + 1:
                raise ValueError("Years must be strictly sequential (e.g. 2026, 2027, 2028)")
        return v

    @field_validator('scores')
    def validate_scores(cls, v: List[float], info) -> List[float]:
        if len(v) < 3:
            raise ValueError("Minimum 3 scores required for prediction")
            
        if 'years' in info.data and len(v) != len(info.data['years']):
            raise ValueError("The number of scores must match the number of years")
        return v

class PredictionResponse(BaseModel):
    predicted_year: int
    predicted_score: float
