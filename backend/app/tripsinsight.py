import os
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from firebase_admin import firestore
from app.database import db
from model.prediction import predict_mileage, MileageFeatures

logger = logging.getLogger(__name__)

class TripCollector:
    
    
    def __init__(self , distance , miladge ):
        self.db = db
        self.trips_collection = "trips"
        self.distance = distance
        self.miladge = miladge
        
        
        list = {}
        
        dis = self.distance
        mil = self.miladge
        list["distance"] = dis
        total_fuel = dis/mil
        list["total_fuel"] = total_fuel
        
        total_spent = total_fuel*108
        list["total_spent"] = total_spent 
        
        co2 = total_fuel*2.6
        list["co2"] = co2
        
        self.save_to_db(list)
    
    
        

    def save_to_db(self, data):
        try:
            doc_ref = self.db.collection(self.trips_collection).document("global_stats")

            doc_ref.set({
                "distance": firestore.Increment(data["distance"]),
                "total_fuel": firestore.Increment(data["total_fuel"]),
                "total_spent": firestore.Increment(data["total_spent"]),
                "co2": firestore.Increment(data["co2"]),
                "updated_at": firestore.SERVER_TIMESTAMP
            }, merge=True)

            return {
                "status": "updated_totals",
                "data_added": data
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    


def get_stats():
    try:
        doc_ref = db.collection("trips").document("global_stats")
        doc = doc_ref.get()

        if not doc.exists:
            return {
                "status": "empty",
                "data": {
                    "distance": 0,
                    "total_fuel": 0,
                    "total_spent": 0,
                    "co2": 0
                }
            }

        data = doc.to_dict()

        return {
            "status": "success",
            "data": data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }