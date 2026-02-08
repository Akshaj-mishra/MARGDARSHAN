import requests
import os
from dotenv import load_dotenv
from model.prediction import predict_mileage, MileageFeatures
from app.database import db

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_nearby_places(location_str: str, place_type: str, radius: int = 5000):
    """Helper to find places near a coordinate using Google Places API."""
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": location_str,
        "radius": radius,
        "type": place_type,
        "key": GOOGLE_API_KEY
    }
    response = requests.get(url, params=params).json()
    return response.get("results", [])[:3] 

def route_optimization(origin_latlng, destination_latlng, vehicle_id: str):
    vehicle_doc = db.collection("vehicles").document(vehicle_id).get()
    if not vehicle_doc.exists:
        return {"error": "Vehicle not found"}
    
    v_data = vehicle_doc.to_dict()

    fuel_capacity = float(v_data.get("fuelCapacity", 60.0))
    engine_cc = int(v_data.get("engineCapacity", 1500))
    payload_kg = float(v_data.get("additionalPayloadWeight") or 0.0)
    weight_kg = float(v_data.get("weight", 2000.0))
    tyres = int(v_data.get("noTyres", 4))

    directions_url = "https://maps.googleapis.com/maps/api/directions/json"
    route_resp = requests.get(directions_url, params={
        "origin": f"{origin_latlng.lat},{origin_latlng.lng}",
        "destination": f"{destination_latlng.lat},{destination_latlng.lng}",
        "key": GOOGLE_API_KEY
    }).json()

    if route_resp['status'] != "OK":
        return {"error": f"Routing failed: {route_resp.get('status')}"}

    route = route_resp['routes'][0]
    total_dist_km = sum(leg['distance']['value'] for leg in route['legs']) / 1000

    features = MileageFeatures(
        distance_km=total_dist_km,
        engine_cc=engine_cc,
        fuel_tank_liters=fuel_capacity,
        payload_kg=payload_kg,
        loaded_weight_kg=weight_kg,
        number_of_tyres=tyres
    )
    
    predicted_mileage_kml = predict_mileage(features)

    
    max_range_km = predicted_mileage_kml * fuel_capacity
    fuel_threshold_km = max_range_km * 0.8 

    stops = []
    cumulative_km = 0
    cumulative_sec = 0
    BREAK_TIME_THRESHOLD = 3600 * 4 

    for leg in route['legs']:
        for step in leg['steps']:
            cumulative_km += step['distance']['value'] / 1000
            cumulative_sec += step['duration']['value']
            coord = f"{step['end_location']['lat']},{step['end_location']['lng']}"

            if cumulative_km >= fuel_threshold_km:
                stations = get_nearby_places(coord, "gas_station")
                stops.append({
                    "type": "Fuel Station", 
                    "at_km": round(cumulative_km, 1), 
                    "places": stations
                })
                cumulative_km = 0 

            if cumulative_sec >= BREAK_TIME_THRESHOLD:
                eateries = get_nearby_places(coord, "restaurant")
                stops.append({
                    "type": "Rest/Food Break", 
                    "at_time_hrs": round(cumulative_sec/3600, 1), 
                    "places": eateries
                })
                cumulative_sec = 0

    return {
        "summary": {
            "vehicle": v_data.get("name"),
            "tank_size": f"{fuel_capacity} L",
            "predicted_mileage": f"{predicted_mileage_kml:.2f} km/l",
            "max_range": f"{max_range_km:.1f} km",
            "safe_fuel_stop_at": f"{fuel_threshold_km:.1f} km"
        },
        "optimized_stops": stops
    }