import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import logging

load_dotenv()
frontend_url = os.getenv("FASTAPI_FRONTEND_SOURCE_LINK") or "http://localhost:3000"

firebase_credentials_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
if not os.path.exists(firebase_credentials_path):
    raise FileNotFoundError(f"Firebase credentials not found at {firebase_credentials_path}")

cred = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

def initialize_database():
    """Initialize the database by creating necessary collections if they don't exist"""
    try:
        vehicles_ref = db.collection("vehicles")
        docs = vehicles_ref.limit(1).stream()
        docs_list = list(docs)
        if not docs_list:
            logger.info("Initializing 'vehicles' collection...")
            vehicles_ref.document("_metadata").set({
                "initialized": True,
                "created_at": firestore.SERVER_TIMESTAMP,
                "description": "Vehicle tracking database"
            })
            logger.info("Database initialized successfully")
        else:
            logger.info("Database already exists")
    except Exception as e:
        logger.error(f"Error during database initialization: {str(e)}")
        raise

initialize_database()

class VehicleModel(BaseModel):
    id: Optional[str] = None
    name: str
    vehicleType: str
    engineCapacity: str
    fuelCapacity: str
    weight: str
    height: str
    milage: str
    noTyres: str
    additionalPayloadWeight: Optional[str] = ""
    additionalPayloadHeight: Optional[str] = ""

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@router.post("/vehicles")
async def create_vehicle(vehicle: VehicleModel):
    try:
        vehicle_data = vehicle.dict(exclude={"id"})
        vehicle_data["created_at"] = firestore.SERVER_TIMESTAMP
        vehicle_data["updated_at"] = firestore.SERVER_TIMESTAMP
        doc_ref = db.collection("vehicles").document()
        doc_ref.set(vehicle_data)
        logger.info(f"Vehicle created successfully with ID: {doc_ref.id}")
        response_data = vehicle.dict(exclude={"id"})
        response_data["id"] = doc_ref.id
        return response_data
    except Exception as e:
        logger.error(f"Error creating vehicle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/vehicles")
async def get_all_vehicles() -> List[VehicleModel]:
    try:
        docs = db.collection("vehicles").stream()
        vehicles = []
        for doc in docs:
            if doc.id == "_metadata":
                continue
            vehicle_data = doc.to_dict()
            vehicle_data["id"] = doc.id
            if "milage" not in vehicle_data:
                vehicle_data["milage"] = ""
            if "noTyres" not in vehicle_data:
                vehicle_data["noTyres"] = ""
            vehicles.append(vehicle_data)
        logger.info(f"Retrieved {len(vehicles)} vehicles from database")
        return vehicles
    except Exception as e:
        logger.error(f"Error retrieving vehicles: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/vehicles/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    try:
        doc = db.collection("vehicles").document(vehicle_id).get()
        if doc.exists:
            vehicle_data = doc.to_dict()
            vehicle_data["id"] = doc.id
            if "milage" not in vehicle_data:
                vehicle_data["milage"] = ""
            if "noTyres" not in vehicle_data:
                vehicle_data["noTyres"] = ""
            logger.info(f"Vehicle {vehicle_id} retrieved successfully")
            return vehicle_data
        else:
            logger.warning(f"Vehicle {vehicle_id} not found")
            raise HTTPException(status_code=404, detail="Vehicle not found")
    except Exception as e:
        logger.error(f"Error retrieving vehicle {vehicle_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/vehicles/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: VehicleModel):
    try:
        vehicle_data = vehicle.dict(exclude={"id"})
        vehicle_data["updated_at"] = firestore.SERVER_TIMESTAMP
        db.collection("vehicles").document(vehicle_id).update(vehicle_data)
        logger.info(f"Vehicle {vehicle_id} updated successfully")
        response_data = vehicle.dict(exclude={"id"})
        response_data["id"] = vehicle_id
        return response_data
    except Exception as e:
        logger.error(f"Error updating vehicle {vehicle_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str):
    try:
        db.collection("vehicles").document(vehicle_id).delete()
        logger.info(f"Vehicle {vehicle_id} deleted successfully")
        return {"message": "Vehicle deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting vehicle {vehicle_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

vehicles_app = FastAPI()
vehicles_app.add_middleware(
    CORSMiddleware,
    allow_origins=list({
        frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    }) if frontend_url else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
vehicles_app.include_router(router)
