import requests
from dotenv import load_dotenv
import os

from model.prediction import predict_mileage, MileageFeatures
from app.database import db

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_route(origin, destination):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{origin.lat},{origin.lng}",
        "destination": f"{destination.lat},{destination.lng}",
        "key": GOOGLE_API_KEY
    }
    return requests.get(url, params=params).json()

def route_optimization():
    # @akshaj add yo ai and route api ting  here
    ...