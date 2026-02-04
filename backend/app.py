import os
from typing import List, Optional

import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from app.database import router as vehicles_router

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
frontend_source = os.getenv("FASTAPI_FRONTEND_SOURCE_LINK") or "http://localhost:3000"
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_MAPS_API_KEY not set in environment")

app = FastAPI(title="Backend", version="1.0.0")

# FastAPI expects a list for CORS. Support both localhost and 127.0.0.1 for dev.
origins = list({
    frontend_source,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}) if frontend_source else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include vehicle CRUD routes
app.include_router(vehicles_router)


class LatLng(BaseModel):
    lat: float
    lng: float


class RouteRequest(BaseModel):
    origin: LatLng
    destination: LatLng
    waypoints: Optional[List[LatLng]] = []
    optimize: bool = True
    travelMode: str = "driving"  
    avoidHighways: bool = False
    avoidTolls: bool = False
    unitSystem: str = "metric" 


@app.get("/geocode")
def geocode(query: str = Query(..., min_length=1)):
    """Geocode a free-form address or place name using Google Geocoding API."""
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": query, "key": GOOGLE_API_KEY}
    r = requests.get(url, params=params, timeout=15)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Geocoding API error")
    data = r.json()
    if data.get("status") != "OK" or not data.get("results"):
        raise HTTPException(status_code=404, detail="No geocode results")
    top = data["results"][0]
    loc = top["geometry"]["location"]
    return {
        "lat": loc["lat"],
        "lng": loc["lng"],
        "formatted_address": top.get("formatted_address", query),
        "place_id": top.get("place_id"),
    }


@app.post("/route")
def get_route(req: RouteRequest):
    """Compute directions with optional waypoint optimization using Google Directions API."""
    url = "https://maps.googleapis.com/maps/api/directions/json"

    waypoints_param = None
    if req.waypoints and len(req.waypoints) > 0:
        wp_list = [f"{w.lat},{w.lng}" for w in req.waypoints]
        if req.optimize:
            waypoints_param = "optimize:true|" + "|".join(wp_list)
        else:
            waypoints_param = "|".join(wp_list)

    params = {
        "origin": f"{req.origin.lat},{req.origin.lng}",
        "destination": f"{req.destination.lat},{req.destination.lng}",
        "key": GOOGLE_API_KEY,
        "mode": req.travelMode.lower(),
        "units": "metric" if req.unitSystem == "metric" else "imperial",
    }


    avoids = []
    if req.avoidHighways:
        avoids.append("highways")
    if req.avoidTolls:
        avoids.append("tolls")
    if avoids:
        params["avoid"] = "|".join(avoids)

    if waypoints_param:
        params["waypoints"] = waypoints_param

    r = requests.get(url, params=params, timeout=30)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Directions API error")
    data = r.json()
    status = data.get("status")
    if status != "OK":
        raise HTTPException(status_code=400, detail=f"Directions failed: {status}")

    route = data["routes"][0]
    legs = route.get("legs", [])
    total_distance_m = sum(l["distance"]["value"] for l in legs)
    total_duration_s = sum(l["duration"]["value"] for l in legs)

    overview = route.get("overview_polyline", {}).get("points")
    waypoint_order = route.get("waypoint_order", []) if req.optimize else list(range(len(req.waypoints or [])))
    bounds = route.get("bounds")

    return {
        "distance_meters": total_distance_m,
        "distance_text": f"{total_distance_m/1000:.1f} km",
        "duration_seconds": total_duration_s,
        "duration_text": f"{int(total_duration_s/60)} min",
        "polyline": overview,
        "waypoint_order": waypoint_order,
        "bounds": bounds,
        "raw": {"legs": legs},
    }


@app.get("/health")
def health():
    return {"status": "ok"}
