import os
import requests
from dotenv import load_dotenv
from app.database import db
from model.prediction import predict_mileage, MileageFeatures

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"


def find_best_place(location: str, place_type: str, radius: int = 5000):
    """Return ONE best nearby place (highest rated if available)."""

    params = {
        "location": location,
        "radius": radius,
        "type": place_type,
        "key": GOOGLE_API_KEY
    }

    r = requests.get(PLACES_URL, params=params, timeout=15)
    data = r.json()

    results = data.get("results", [])
    if not results:
        return None

    results.sort(key=lambda x: x.get("rating", 0), reverse=True)
    top = results[0]

    loc = top["geometry"]["location"]

    return {
        "name": top.get("name"),
        "lat": loc["lat"],
        "lng": loc["lng"],
        "address": top.get("vicinity"),
        "rating": top.get("rating")
    }


def route_optimization(origin_latlng, destination_latlng, vehicle_id: str):
    vehicle_doc = db.collection("vehicles").document(vehicle_id).get()

    if not vehicle_doc.exists:
        return {"error": "Vehicle not found"}

    v = vehicle_doc.to_dict()

    fuel_capacity = float(v.get("fuelCapacity"))
    engine_cc = int(v.get("engineCapacity"))
    payload = float(v.get("additionalPayloadWeight"))
    weight = float(v.get("weight"))
    tyres = int(v.get("noTyres"))

    route_resp = requests.get(
        DIRECTIONS_URL,
        params={
            "origin": f"{origin_latlng.lat},{origin_latlng.lng}",
            "destination": f"{destination_latlng.lat},{destination_latlng.lng}",
            "key": GOOGLE_API_KEY
        },
        timeout=20
    ).json()

    if route_resp.get("status") != "OK":
        return {"error": "Google routing failed"}

    route = route_resp["routes"][0]

    total_km = sum(
        leg["distance"]["value"] for leg in route["legs"]
    ) / 1000

    features = MileageFeatures(
        distance_km=total_km,
        engine_cc=engine_cc,
        fuel_tank_liters=fuel_capacity,
        payload_kg=payload,
        loaded_weight_kg=weight,
        number_of_tyres=tyres
    )

    mileage = predict_mileage(features)

    max_range = mileage * fuel_capacity
    fuel_trigger_km = max_range * 0.5
    break_trigger_sec = 4 * 3600

    stops = []
    traveled_km = 0
    traveled_sec = 0

    for leg in route["legs"]:
        for step in leg["steps"]:
            traveled_km += step["distance"]["value"] / 1000
            traveled_sec += step["duration"]["value"]

            coord = f"{step['end_location']['lat']},{step['end_location']['lng']}"

            if traveled_km >= fuel_trigger_km:
                station = find_best_place(coord, "gas_station")
                if station:
                    stops.append({
                        "type": "fuel",
                        "at_km": round(traveled_km, 1),
                        "place": station
                    })
                traveled_km = 0

            if traveled_sec >= break_trigger_sec:
                food = find_best_place(coord, "restaurant")
                if food:
                    stops.append({
                        "type": "break",
                        "at_hours": round(traveled_sec / 3600, 1),
                        "place": food
                    })
                traveled_sec = 0

    return {
        "summary": {
            "vehicle": v.get("name"),
            "predicted_mileage": round(mileage, 2),
            "fuel_capacity_l": fuel_capacity,
            "max_range_km": round(max_range, 1),
            "safe_stop_km": round(fuel_trigger_km, 1)
        },
        "optimized_stops": stops
    }
