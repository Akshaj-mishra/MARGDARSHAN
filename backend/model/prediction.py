import os
import numpy as np
import xgboost as xgb
from pydantic import BaseModel, Field

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.json")

model = xgb.Booster()
model.load_model(MODEL_PATH)

class MileageFeatures(BaseModel):
    distance_km: float = Field(..., gt=0)
    engine_cc: int = Field(..., gt=0)
    fuel_tank_liters: float = Field(..., gt=0)
    payload_kg: float = Field(..., ge=0)
    loaded_weight_kg: float = Field(..., ge=0)
    number_of_tyres: int = Field(..., ge=2)

FEATURE_ORDER = [
    "distance_km",
    "engine_cc",
    "fuel_tank_liters",
    "payload_kg",
    "loaded_weight_kg",
    "number_of_tyres",
]

def predict_mileage(features: MileageFeatures) -> float:

    values = [getattr(features, f) for f in FEATURE_ORDER]
    

    X = np.array([values])
    
    
    dmatrix = xgb.DMatrix(X, feature_names=FEATURE_ORDER)

    prediction = model.predict(dmatrix)
    return float(prediction[0])