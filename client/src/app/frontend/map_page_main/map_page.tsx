"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

type Waypoint = {
  location: any;
  name: string;
  id: number;
};

type Vehicle = {
  id?: string;
  name: string;
  vehicleType: string;
  engineCapacity: string;
  weight: string;
  height: string;
  additionalPayloadWeight?: string;
  additionalPayloadHeight?: string;
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
  const [routePolyline, setRoutePolyline] = useState<any>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const stopInputRef = useRef<HTMLInputElement>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopAddress, setStopAddress] = useState("");
  const [searchOverlay, setSearchOverlay] = useState<{
    open: boolean;
    mode: "origin" | "destination" | null;
  }>({ open: false, mode: null });
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editablePayloadWeight, setEditablePayloadWeight] =
    useState<string>("");
  const [editablePayloadHeight, setEditablePayloadHeight] =
    useState<string>("");

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const el = document.documentElement;
      if (el.classList.contains("dark")) return true;
      const stored = localStorage.getItem("theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq && mq.addEventListener) mq.addEventListener("change", listener);
      if (isDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return () => {
        if (mq && mq.removeEventListener)
          mq.removeEventListener("change", listener);
      };
    } catch (e) {
      // noop
    }
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {}
  };

  const openSearchOverlay = (mode: "origin" | "destination") => {
    setSearchOverlay({ open: true, mode });
    setTimeout(() => overlayInputRef.current?.focus(), 50);
  };
  const closeSearchOverlay = () =>
    setSearchOverlay({ open: false, mode: null });

  const openVehicleSelector = () => {
    setShowVehicleModal(true);
  };
  const closeVehicleSelector = () => {
    setShowVehicleModal(false);
  };

  const fetchVehicles = useCallback(async () => {
    try {
      setVehiclesLoading(true);
      setVehiclesError(null);
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const resp = await fetch(`${backendUrl}/vehicles`);
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "Failed to fetch vehicles");
      }
      const data = await resp.json();
      if (Array.isArray(data)) {
        setVehicles(data as Vehicle[]);
      } else {
        setVehicles([]);
      }
    } catch (e: any) {
      setVehiclesError(e?.message || "Unable to load vehicles");
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showVehicleModal) {
      fetchVehicles();
    }
  }, [showVehicleModal, fetchVehicles]);

  useEffect(() => {
    if (!searchOverlay.open || typeof window === "undefined") return;
    const gmaps = (window as any).google?.maps;
    if (!gmaps || !overlayInputRef.current) return;
    const ac = new gmaps.places.Autocomplete(overlayInputRef.current, {
      types: ["establishment", "geocode"],
    });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place || !place.geometry) return;
      if (searchOverlay.mode === "origin") {
        setOrigin(place.geometry.location);
        if (originInputRef.current)
          originInputRef.current.value =
            place.formatted_address || place.name || "";
      } else if (searchOverlay.mode === "destination") {
        setDestination(place.geometry.location);
        if (destinationInputRef.current)
          destinationInputRef.current.value =
            place.formatted_address || place.name || "";
      }
      closeSearchOverlay();
    });
    return () => {};
  }, [searchOverlay.open, searchOverlay.mode]);

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
        'script[src*="maps.googleapis.com"]',
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
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
                { types: ["establishment", "geocode"] },
              );
              originAutocomplete.bindTo("bounds", mapInstance);
              originAutocomplete.addListener("place_changed", () => {
                const place = originAutocomplete.getPlace();
                if (place.geometry && isMounted) {
                  setOrigin(place.geometry.location);
                  if (originInputRef.current)
                    originInputRef.current.value =
                      place.formatted_address || place.name || "";
                }
              });
            }

            if (destinationInputRef.current && gmaps.places) {
              const destAutocomplete = new gmaps.places.Autocomplete(
                destinationInputRef.current,
                { types: ["establishment", "geocode"] },
              );
              destAutocomplete.bindTo("bounds", mapInstance);
              destAutocomplete.addListener("place_changed", () => {
                const place = destAutocomplete.getPlace();
                if (place.geometry && isMounted) {
                  setDestination(place.geometry.location);
                  if (destinationInputRef.current)
                    destinationInputRef.current.value =
                      place.formatted_address || place.name || "";
                }
              });
            }

            const searchInput = document.getElementById(
              "search-input",
            ) as HTMLInputElement;
            if (searchInput && gmaps.places && isMounted) {
              const autocomplete = new gmaps.places.Autocomplete(searchInput, {
                types: ["establishment", "geocode"],
              });
              autocomplete.bindTo("bounds", mapInstance);
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry && isMounted) {
                  if (typeof addWaypoint === "function") addWaypoint(place);
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

  const optimizeRoute = async () => {
    if (!origin || !destination) {
      alert("Please select both origin and destination locations");
      return;
    }
    setIsLoading(true);
    try {
      const gmaps = (window as any).google.maps;
      const toPlain = (loc: any) => ({
        lat: typeof loc.lat === "function" ? loc.lat() : loc.lat,
        lng: typeof loc.lng === "function" ? loc.lng() : loc.lng,
      });
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const body = {
        origin: toPlain(origin),
        destination: toPlain(destination),
        waypoints: waypoints.map((wp: any) => toPlain(wp.location)),
        optimize: true,
        travelMode: "driving",
        unitSystem: "metric",
        avoidHighways: false,
        avoidTolls: false,
      };
      const resp = await fetch(`${backendUrl}/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "Route API error");
      }
      const data = await resp.json();

      if (routePolyline && routePolyline.setMap) {
        routePolyline.setMap(null);
      }
      const path = gmaps.geometry.encoding.decodePath(data.polyline);
      const polyline = new gmaps.Polyline({
        path,
        strokeColor: "#FFD600",
        strokeOpacity: 1,
        strokeWeight: 4,
      });
      polyline.setMap(map);
      setRoutePolyline(polyline);

      if (map && path.length) {
        if (data.bounds?.northeast && data.bounds?.southwest) {
          const bounds = new gmaps.LatLngBounds(
            new gmaps.LatLng(
              data.bounds.southwest.lat,
              data.bounds.southwest.lng,
            ),
            new gmaps.LatLng(
              data.bounds.northeast.lat,
              data.bounds.northeast.lng,
            ),
          );
          map.fitBounds(bounds);
        } else {
          const bounds = new gmaps.LatLngBounds();
          path.forEach((pt: any) => bounds.extend(pt));
          map.fitBounds(bounds);
        }
      }

      setTotalDistance(data.distance_text || "");
      setTotalDuration(data.duration_text || "");
    } catch (error: any) {
      alert("Could not calculate route: " + error?.message || error);
    }
    setIsLoading(false);
  };

  const removeWaypoint = (id: number) => {
    const newWaypoints = waypoints.filter((wp: Waypoint) => wp.id !== id);
    setWaypoints(newWaypoints);

    if (routePolyline && routePolyline.setMap) {
      routePolyline.setMap(null);
      setRoutePolyline(null);
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
    if (routePolyline && routePolyline.setMap) {
      routePolyline.setMap(null);
      setRoutePolyline(null);
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
      "search-input",
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

  const addWaypoint = useCallback(
    (place: any) => {
      if (!map) return;
      const gmaps = (window as any).google.maps;
      const location = place.geometry?.location || place.geometry || null;
      const name = place.name || place.formatted_address || "Unknown";
      const newWaypoint: Waypoint = {
        location,
        name,
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

      const searchInput = document.getElementById(
        "search-input",
      ) as HTMLInputElement;
      if (searchInput) searchInput.value = "";
    },
    [map],
  );

  const openStopModal = () => setShowStopModal(true);
  const closeStopModal = () => {
    setShowStopModal(false);
    setStopAddress("");
  };

  const handleAddStop = async () => {
    if (!stopAddress || !map) return;
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const resp = await fetch(
        `${backendUrl}/geocode?query=${encodeURIComponent(stopAddress)}`,
      );
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "Geocode API error");
      }
      const data = await resp.json();
      const gmaps = (window as any).google.maps;
      const loc = new gmaps.LatLng(data.lat, data.lng);
      addWaypoint({
        geometry: { location: loc },
        name: data.formatted_address || stopAddress,
        formatted_address: data.formatted_address || stopAddress,
      });
      closeStopModal();
    } catch (e: any) {
      alert("Could not find location for stop: " + (e?.message || stopAddress));
    }
  };

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
          },
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

  const reorderWaypoints = (fromIndex: number, toIndex: number) => {
    setWaypoints((prev) => {
      const items = [...prev];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      if (map) {
        clearMarkers();
        const gmaps = (window as any).google.maps;
        items.forEach((wp: Waypoint, idx: number) => {
          const marker = new gmaps.Marker({
            position: wp.location,
            map: map,
            title: wp.name,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#3b82f6"/>
                  <circle cx="16" cy="16" r="8" fill="white"/>
                  <text x="16" y="20" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">${
                    idx + 1
                  }</text>
                </svg>
              `)}`,
              scaledSize: new gmaps.Size(32, 40),
              anchor: new gmaps.Point(16, 40),
            },
          });
          markersRef.current.push(marker);
        });
      }
      return items;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="absolute top-4 left-0 right-0 z-50 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-2">
            <div
              className={`flex flex-col sm:flex-row gap-2 sm:gap-4 rounded-xl p-2 shadow-sm ${
                isDark
                  ? "bg-black/70 text-white backdrop-blur-sm"
                  : "bg-white/80 text-gray-900 backdrop-blur-md"
              }`}
            >
              <div className="flex-1">
                {origin ? (
                  <button
                    onClick={() => openSearchOverlay("origin")}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                    title="Edit origin"
                  >
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                    <span className="truncate">
                      {originInputRef.current?.value || "Origin"}
                    </span>
                  </button>
                ) : (
                  <input
                    ref={originInputRef}
                    type="text"
                    placeholder="Start location (Tap to search/set on map)"
                    onFocus={() => openSearchOverlay("origin")}
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                {destination ? (
                  <button
                    onClick={() => openSearchOverlay("destination")}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                    title="Edit destination"
                  >
                    <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      B
                    </span>
                    <span className="truncate">
                      {destinationInputRef.current?.value || "Destination"}
                    </span>
                  </button>
                ) : (
                  <input
                    ref={destinationInputRef}
                    type="text"
                    placeholder="End location (Tap to search/set on map)"
                    onFocus={() => openSearchOverlay("destination")}
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={openStopModal}
                  className="w-10 h-10 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow"
                  title="Add Stop"
                >
                  <svg
                    className="w-5 h-5 text-black"
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
                </button>
                <button
                  type="button"
                  onClick={openVehicleSelector}
                  className="px-3 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-sm text-gray-800 flex items-center gap-2"
                  title="Select Vehicle"
                >
                  <svg
                    className="w-4 h-4 text-blue-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 13l2-2h14l2 2" />
                    <path d="M5 11l1-3h12l1 3" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                  <span className="truncate">
                    {selectedVehicle
                      ? `Vehicle: ${selectedVehicle.name}`
                      : "Select Vehicle"}
                  </span>
                </button>
                <button
                  onClick={optimizeRoute}
                  disabled={!origin || !destination || isLoading}
                  className={`px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors min-w-[100px] flex items-center justify-center text-sm`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Optimize Route"
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

                <button
                  onClick={toggleTheme}
                  title={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className="ml-2 w-10 h-10 bg-transparent rounded-full flex items-center justify-center text-sm border border-transparent hover:border-gray-300"
                >
                  {isDark ? (
                    <svg
                      className="w-5 h-5 text-yellow-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className={`rounded-lg shadow-lg p-6 w-full max-w-xs mx-auto ${
              isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold mb-3">Add Stop</h2>
            <input
              ref={stopAutocompleteRef}
              type="text"
              value={stopAddress}
              onChange={(e) => setStopAddress(e.target.value)}
              placeholder="Enter stop address..."
              className={`w-full px-3 py-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                isDark
                  ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">Current Stops</h3>
              <ul className="space-y-1">
                {waypoints.map((wp, idx) => (
                  <li
                    key={wp.id}
                    draggable
                    onDragStart={(e) => {
                      dragIndexRef.current = idx;
                      e.dataTransfer?.setData("text/plain", String(idx));
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from =
                        dragIndexRef.current ??
                        Number(e.dataTransfer.getData("text/plain"));
                      const to = idx;
                      if (from !== null && from !== to)
                        reorderWaypoints(from, to);
                      dragIndexRef.current = null;
                    }}
                    className={`flex items-center justify-between px-2 py-1 rounded ${
                      isDark ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="cursor-move text-gray-400">≡</span>
                      <span className="truncate text-xs">
                        {idx + 1}. {wp.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeWaypoint(wp.id)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                        title="Remove stop"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeStopModal}
                className={`px-3 py-2 rounded-lg font-medium ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStop}
                className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className={`rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto ${
              isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Select Vehicle</h2>
              <button
                onClick={closeVehicleSelector}
                className={`text-sm px-2 py-1 rounded ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Close
              </button>
            </div>

            {vehiclesLoading && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Loading vehicles...</p>
              </div>
            )}

            {!vehiclesLoading && vehiclesError && (
              <div className="text-sm text-red-600">{vehiclesError}</div>
            )}

            {!vehiclesLoading && !vehiclesError && (
              <div className="max-h-80 overflow-auto divide-y divide-gray-200">
                {vehicles.length === 0 ? (
                  <p className="text-sm text-gray-500">No vehicles found.</p>
                ) : (
                  vehicles.map((v) => (
                    <div
                      key={v.id || v.name}
                      className="py-3 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{v.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          Type: {v.vehicleType} • Engine: {v.engineCapacity} •
                          Weight: {v.weight} • Height: {v.height}
                        </p>
                        {selectedVehicle?.id === v.id && (
                          <div className="mt-2 space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Additional Payload Weight (kg)
                              </label>
                              <input
                                type="text"
                                value={editablePayloadWeight}
                                onChange={(e) =>
                                  setEditablePayloadWeight(e.target.value)
                                }
                                placeholder="Enter additional weight..."
                                className={`w-full px-2 py-1 text-xs rounded border ${
                                  isDark
                                    ? "bg-gray-800 border-gray-700 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Additional Payload Height (m)
                              </label>
                              <input
                                type="text"
                                value={editablePayloadHeight}
                                onChange={(e) =>
                                  setEditablePayloadHeight(e.target.value)
                                }
                                placeholder="Enter additional height..."
                                className={`w-full px-2 py-1 text-xs rounded border ${
                                  isDark
                                    ? "bg-gray-800 border-gray-700 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (selectedVehicle?.id === v.id) {
                            setSelectedVehicle({
                              ...v,
                              additionalPayloadWeight:
                                editablePayloadWeight ||
                                v.additionalPayloadWeight,
                              additionalPayloadHeight:
                                editablePayloadHeight ||
                                v.additionalPayloadHeight,
                            });
                            closeVehicleSelector();
                          } else {
                            setSelectedVehicle(v);
                            setEditablePayloadWeight(
                              v.additionalPayloadWeight || "",
                            );
                            setEditablePayloadHeight(
                              v.additionalPayloadHeight || "",
                            );
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                          selectedVehicle?.id === v.id
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {selectedVehicle?.id === v.id ? "Apply" : "Select"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedVehicle && (
              <div
                className={`mt-3 text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                <p>
                  <span className="font-medium">
                    Current: {selectedVehicle.name}
                  </span>
                </p>
                {(selectedVehicle.additionalPayloadWeight ||
                  selectedVehicle.additionalPayloadHeight) && (
                  <p className="mt-1">
                    Additional Payload:
                    {selectedVehicle.additionalPayloadWeight &&
                      ` Weight: ${selectedVehicle.additionalPayloadWeight} kg`}
                    {selectedVehicle.additionalPayloadHeight &&
                      ` • Height: ${selectedVehicle.additionalPayloadHeight} m`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {searchOverlay.open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-start pt-12">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  ref={overlayInputRef}
                  type="search"
                  placeholder={
                    searchOverlay.mode === "origin"
                      ? "Search origin..."
                      : "Search destination..."
                  }
                  className={`w-full px-3 py-3 rounded-lg focus:outline-none ${
                    isDark
                      ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <button
                  onClick={closeSearchOverlay}
                  className="px-3 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Tap a suggestion to set the {searchOverlay.mode}
              </p>
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
