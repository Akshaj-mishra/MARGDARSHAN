"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

type Waypoint = {
  location: any;
  name: string;
  id: number;
};

function RouteOptimizerComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const scriptLoadedRef = useRef(false);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const stopInputRef = useRef<HTMLInputElement>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopAddress, setStopAddress] = useState("");

  const mapStyles = [
    {
      elementType: "geometry",
      stylers: [{ color: "#393E46" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#e0e0e0" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#181818" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#1976d2" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#1976d2" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
  ];

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];
  }, []);

  const loadGoogleMapsScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any)?.google?.maps) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps"))
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps script"));
      };

      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();

        if (!isMounted || !mapRef.current) return;

        const gmaps = (window as any).google.maps;
        const mapInstance = new gmaps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 13,
          styles: mapStyles,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: gmaps.ControlPosition.RIGHT_BOTTOM,
          },
        });

        const directionsServiceInstance = new gmaps.DirectionsService();
        const directionsRendererInstance = new gmaps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: "#FFD600",
            strokeWeight: 4,
            strokeOpacity: 1,
          },
          suppressMarkers: true,
        });

        directionsRendererInstance.setMap(mapInstance);

        if (isMounted) {
          setMap(mapInstance);
          setDirectionsService(directionsServiceInstance);
          setDirectionsRenderer(directionsRendererInstance);
          setIsMapReady(true);

          setTimeout(() => {
            if (originInputRef.current && gmaps.places) {
              const originAutocomplete = new gmaps.places.Autocomplete(
                originInputRef.current,
                {
                  types: ["establishment", "geocode"],
                }
              );
              originAutocomplete.bindTo("bounds", mapInstance);
              originAutocomplete.addListener("place_changed", () => {
                const place = originAutocomplete.getPlace();
                if (place.geometry && isMounted) {
                  setOrigin(place.geometry.location);
                  originInputRef.current.value =
                    place.formatted_address || place.name || "";
                }
              });
            }
            if (destinationInputRef.current && gmaps.places) {
              const destAutocomplete = new gmaps.places.Autocomplete(
                destinationInputRef.current,
                {
                  types: ["establishment", "geocode"],
                }
              );
              destAutocomplete.bindTo("bounds", mapInstance);
              destAutocomplete.addListener("place_changed", () => {
                const place = destAutocomplete.getPlace();
                if (place.geometry && isMounted) {
                  setDestination(place.geometry.location);
                  destinationInputRef.current.value =
                    place.formatted_address || place.name || "";
                }
              });
            }
            const searchInput = document.getElementById(
              "search-input"
            ) as HTMLInputElement;
            if (searchInput && gmaps.places && isMounted) {
              const autocomplete = new gmaps.places.Autocomplete(searchInput, {
                types: ["establishment", "geocode"],
              });
              autocomplete.bindTo("bounds", mapInstance);
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry && isMounted) {
                  addWaypoint(place);
                }
              });
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        if (isMounted) {
          setIsMapReady(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
      clearMarkers();
    };
  }, [loadGoogleMapsScript, clearMarkers]);

  const addWaypoint = useCallback(
    (place: any) => {
      if (!map) return;

      const gmaps = (window as any).google.maps;
      const newWaypoint: Waypoint = {
        location: place.geometry?.location,
        name: place.name || place.formatted_address || "Unknown",
        id: Date.now(),
      };

      setWaypoints((prev: Waypoint[]) => {
        const updatedWaypoints = [...prev, newWaypoint];

        const marker = new gmaps.Marker({
          position: newWaypoint.location,
          map: map,
          title: newWaypoint.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#3b82f6"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <text x="16" y="20" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">${updatedWaypoints.length}</text>
            </svg>
          `)}`,
            scaledSize: new gmaps.Size(32, 40),
            anchor: new gmaps.Point(16, 40),
          },
        });

        markersRef.current.push(marker);
        return updatedWaypoints;
      });

      setSearchQuery("");

      const searchInput = document.getElementById(
        "search-input"
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.value = "";
      }
    },
    [map]
  );

  const optimizeRoute = async () => {
    if (!origin || !destination) {
      alert("Please select both origin and destination locations");
      return;
    }
    setIsLoading(true);
    const gmaps = (window as any)["google"].maps;
    const request = {
      origin: origin,
      destination: destination,
      waypoints: waypoints.map((wp: any) => ({
        location: wp.location,
        stopover: true,
      })),
      optimizeWaypoints: true,
      travelMode: gmaps.TravelMode.DRIVING,
      unitSystem: gmaps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };
    try {
      const result: any = await new Promise((resolve, reject) => {
        directionsService.route(request, (result: any, status: any) => {
          if (status === "OK") {
            resolve(result);
          } else {
            reject(status);
          }
        });
      });
      directionsRenderer.setDirections(result);
      let totalDist = 0;
      let totalTime = 0;
      (result.routes[0].legs as any[]).forEach((leg: any) => {
        totalDist += leg.distance.value;
        totalTime += leg.duration.value;
      });
      setTotalDistance((totalDist / 1000).toFixed(1) + " km");
      setTotalDuration(Math.floor(totalTime / 60) + " min");
    } catch (error) {
      alert("Could not calculate route: " + error);
    }
    setIsLoading(false);
  };

  const removeWaypoint = (id: number) => {
    const newWaypoints = waypoints.filter((wp: Waypoint) => wp.id !== id);
    setWaypoints(newWaypoints);

    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
    clearMarkers();
    setTotalDistance("");
    setTotalDuration("");

    setTimeout(() => {
      newWaypoints.forEach((waypoint, index) => {
        if (map) {
          const gmaps = (window as any).google.maps;
          const marker = new gmaps.Marker({
            position: waypoint.location,
            map: map,
            title: waypoint.name,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#3b82f6"/>
                  <circle cx="16" cy="16" r="8" fill="white"/>
                  <text x="16" y="20" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">${
                    index + 1
                  }</text>
                </svg>
              `)}`,
              scaledSize: new gmaps.Size(32, 40),
              anchor: new gmaps.Point(16, 40),
            },
          });
          markersRef.current.push(marker);
        }
      });
    }, 100);
  };

  const clearAll = () => {
    setWaypoints([]);
    clearMarkers();
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
    setTotalDistance("");
    setTotalDuration("");
    setOrigin(null);
    setDestination(null);
    if (map) {
      map.setCenter({ lat: 28.6139, lng: 77.209 });
      map.setZoom(13);
    }
    if (originInputRef.current) originInputRef.current.value = "";
    if (destinationInputRef.current) destinationInputRef.current.value = "";
    const searchInput = document.getElementById(
      "search-input"
    ) as HTMLInputElement;
    if (searchInput) searchInput.value = "";
    setSearchQuery("");
  };

  const recenterMap = () => {
    if (map) {
      map.setCenter({ lat: 28.6139, lng: 77.209 });
      map.setZoom(13);
    }
  };

  const openStopModal = () => setShowStopModal(true);
  const closeStopModal = () => {
    setShowStopModal(false);
    setStopAddress("");
  };
  const handleAddStop = () => {
    if (!stopAddress || !map) return;
    const gmaps = (window as any).google.maps;
    const geocoder = new gmaps.Geocoder();
    geocoder.geocode({ address: stopAddress }, (results: any, status: any) => {
      if (status === "OK" && results[0].geometry) {
        addWaypoint({
          geometry: { location: results[0].geometry.location },
          name: stopAddress,
          formatted_address: results[0].formatted_address,
        });
        closeStopModal();
      } else {
        alert("Could not find location for stop: " + stopAddress);
      }
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        if ((window as any)["google"] && (window as any)["google"].maps) {
          clearInterval(interval);
          initializeMap();
        }
      }, 100);
      return () => {
        clearInterval(interval);
        if (directionsRenderer) directionsRenderer.setMap(null);
      };
    }
  }, []);

  const stopAutocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      showStopModal &&
      stopAutocompleteRef.current &&
      typeof window !== "undefined"
    ) {
      const gmaps = (window as any).google.maps;
      if (gmaps && gmaps.places) {
        const stopAutocomplete = new gmaps.places.Autocomplete(
          stopAutocompleteRef.current,
          {
            types: ["establishment", "geocode"],
          }
        );
        stopAutocomplete.addListener("place_changed", () => {
          const place = stopAutocomplete.getPlace();
          if (place.geometry) {
            setStopAddress(place.formatted_address || place.name || "");
          }
        });
      }
    }
  }, [showStopModal]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                ref={originInputRef}
                type="text"
                placeholder="Origin..."
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                ref={destinationInputRef}
                type="text"
                placeholder="Destination..."
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={openStopModal}
                  className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors min-w-[100px] flex items-center justify-center text-sm"
                  title="Add Stop"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Stop
                </button>
                <button
                  onClick={optimizeRoute}
                  disabled={!origin || !destination || isLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors min-w-[100px] flex items-center justify-center text-sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Optimize"
                  )}
                </button>
                {(waypoints.length > 0 || origin || destination) && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg font-medium transition-colors text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-auto">
            <h2 className="text-lg font-semibold mb-3">Add Stop</h2>
            <input
              ref={stopAutocompleteRef}
              type="text"
              value={stopAddress}
              onChange={(e) => setStopAddress(e.target.value)}
              placeholder="Enter stop address..."
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">Current Stops</h3>
              <ul className="space-y-1">
                {waypoints.map((wp, idx) => (
                  <li
                    key={wp.id}
                    className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                  >
                    <span className="truncate text-xs">{wp.name}</span>
                    <button
                      type="button"
                      onClick={() => removeWaypoint(wp.id)}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                      title="Remove stop"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeStopModal}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStop}
                className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex-1 flex flex-col">
        <div
          ref={mapRef}
          className="w-full h-full bg-gray-100 rounded-lg shadow flex-1"
          style={{ minHeight: "300px" }}
        />
        <button
          type="button"
          onClick={recenterMap}
          className="fixed bottom-6 right-6 z-50 bg-white border border-gray-300 shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-50 transition-colors"
          title="Recenter Map"
        >
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
          </svg>
        </button>

        {!isMapReady && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )}

        {isLoading && isMapReady && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-900 font-medium">Optimizing route...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const RouteOptimizer = dynamic(() => Promise.resolve(RouteOptimizerComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Route Optimizer...</p>
      </div>
    </div>
  ),
});

export default RouteOptimizer;
