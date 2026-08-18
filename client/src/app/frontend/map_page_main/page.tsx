"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

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
  userId?: string;
};

function RouteOptimizerComponent() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

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
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [routePolyline, setRoutePolyline] = useState<any>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const stopInputRef = useRef<HTMLInputElement>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopAddress, setStopAddress] = useState("");
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

  const openVehicleSelector = () => {
    setShowVehicleModal(true);
  };
  const closeVehicleSelector = () => {
    setShowVehicleModal(false);
  };

  const fetchVehicles = useCallback(async () => {
    const uid = currentUser?.uid || auth.currentUser?.uid;
    if (!uid) {
      setVehiclesError("User not logged in");
      setVehicles([]);
      return;
    }
    try {
      setVehiclesLoading(true);
      setVehiclesError(null);
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const resp = await fetch(`${backendUrl}/vehicles?userId=${uid}`);
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
  }, [currentUser]);

  useEffect(() => {
    if (showVehicleModal) {
      fetchVehicles();
    }
  }, [showVehicleModal, fetchVehicles]);

  const darkMapStyles = [
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

  const lightMapStyles = [
    {
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#111111" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#f8fafc" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f1f5f9" }],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#bfdbfe" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#1e3a8a" }],
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
          styles: isDark ? darkMapStyles : lightMapStyles,
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
                  setOriginText(place.formatted_address || place.name || "");
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
                  setDestinationText(
                    place.formatted_address || place.name || "",
                  );
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

  useEffect(() => {
    if (!map) return;
    map.setOptions({ styles: isDark ? darkMapStyles : lightMapStyles });
  }, [map, isDark]);

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
        vehicle_id: selectedVehicle?.id || "default",
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

      // Add optimized fuel/break stops to the map
      if (data.raw?.optimization?.optimized_stops) {
        data.raw.optimization.optimized_stops.forEach((stop: any) => {
          const isFuel = stop.type === "fuel";
          const stopMarker = new gmaps.Marker({
            position: { lat: stop.place.lat, lng: stop.place.lng },
            map: map,
            title: `${stop.type.toUpperCase()}: ${stop.place.name}`,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="${isFuel ? '#ef4444' : '#10b981'}" stroke="white" stroke-width="2"/>
                  <path d="${isFuel ? 'M12 6v6l4 2' : 'M8 8h8v8H8z'}" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              `)}`,
              scaledSize: new gmaps.Size(32, 32),
              anchor: new gmaps.Point(16, 16),
            },
          });

          const infoWindow = new gmaps.InfoWindow({
            content: `
              <div style="color: black; padding: 5px;">
                <strong>${isFuel ? "⛽ Fuel Station" : "🍴 Break Stop"}</strong><br/>
                ${stop.place.name}<br/>
                Rating: ${stop.place.rating || "N/A"} ⭐<br/>
                ${isFuel ? `At km: ${stop.at_km}` : `At hours: ${stop.at_hours}`}
              </div>
            `,
          });

          stopMarker.addListener("click", () => {
            infoWindow.open(map, stopMarker);
          });

          markersRef.current.push(stopMarker);
        });
      }

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
      alert("Could not calculate route: " + (error?.message || error));
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
    setOriginText("");
    setDestinationText("");
    if (map) {
      map.setCenter({ lat: 28.6139, lng: 77.209 });
      map.setZoom(13);
    }
    const searchInput = document.getElementById(
      "search-input",
    ) as HTMLInputElement;
    if (searchInput) searchInput.value = "";
    setSearchQuery("");
  };

  const swapOriginDestination = () => {
    const currentOrigin = origin;
    const currentDestination = destination;
    const currentOriginText = originText;
    const currentDestinationText = destinationText;
    setOrigin(currentDestination);
    setDestination(currentOrigin);
    setOriginText(currentDestinationText);
    setDestinationText(currentOriginText);
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
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => router.push('/frontend/dashboard')}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isDark
                    ? "bg-black/70 text-gray-300 hover:bg-black/90 hover:text-white border border-white/10"
                    : "bg-white/90 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200"
                } shadow-xl backdrop-blur-md`}
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            <div
              className={`rounded-2xl p-3 sm:p-4 border shadow-xl ${
                isDark
                  ? "bg-black/70 text-white backdrop-blur-md border-white/10"
                  : "bg-white/90 text-gray-900 backdrop-blur-md border-gray-200"
              }`}
            >
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3 items-start">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-2 lg:gap-3 items-end">
                  <div className="space-y-1">
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                        isDark
                          ? "bg-gray-900/80 border-gray-700"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        A
                      </span>
                      <input
                        ref={originInputRef}
                        type="text"
                        value={originText}
                        onChange={(e) => setOriginText(e.target.value)}
                        placeholder="Enter pickup location"
                        className={`w-full bg-transparent text-sm focus:outline-none ${
                          isDark
                            ? "text-white placeholder-gray-400"
                            : "text-gray-900 placeholder-gray-500"
                        }`}
                      />
                      {originText && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrigin(null);
                            setOriginText("");
                          }}
                          className={`text-xs px-2 py-1 rounded-md ${
                            isDark
                              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                          title="Clear source"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={swapOriginDestination}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                        isDark
                          ? "border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200"
                          : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                      }`}
                      title="Swap source and destination"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7h11m0 0l-3-3m3 3l-3 3M16 17H5m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                        isDark
                          ? "bg-gray-900/80 border-gray-700"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        B
                      </span>
                      <input
                        ref={destinationInputRef}
                        type="text"
                        value={destinationText}
                        onChange={(e) => setDestinationText(e.target.value)}
                        placeholder="Enter drop location"
                        className={`w-full bg-transparent text-sm focus:outline-none ${
                          isDark
                            ? "text-white placeholder-gray-400"
                            : "text-gray-900 placeholder-gray-500"
                        }`}
                      />
                      {destinationText && (
                        <button
                          type="button"
                          onClick={() => {
                            setDestination(null);
                            setDestinationText("");
                          }}
                          className={`text-xs px-2 py-1 rounded-md ${
                            isDark
                              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                          title="Clear destination"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap xl:justify-end gap-2">
                <button
                  type="button"
                  onClick={openStopModal}
                  className="h-10 px-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl flex items-center justify-center shadow text-black text-sm font-semibold gap-2"
                  title="Add Stop"
                >
                  <svg
                    className="w-4 h-4 text-black"
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
                  <span>Add Stop</span>
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
                  className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center text-sm border border-transparent hover:border-gray-300"
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
      </div>

      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div
            className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl border p-4 sm:p-6 mx-auto max-h-[90vh] flex flex-col ${
              isDark
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Manage Stops</h2>
              <button
                type="button"
                onClick={closeStopModal}
                className={`text-xs px-2 py-1 rounded-md ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                Close
              </button>
            </div>

            <div
              className={`rounded-xl border p-3 mb-3 ${
                isDark ? "border-gray-700 bg-gray-900/70" : "border-gray-200 bg-gray-50"
              }`}
            >
              <label
                className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Add New Stop
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={stopAutocompleteRef}
                  type="text"
                  value={stopAddress}
                  onChange={(e) => setStopAddress(e.target.value)}
                  placeholder="Search stop address..."
                  className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    isDark
                      ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <button
                  onClick={handleAddStop}
                  className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="mb-3 flex-1 min-h-0 flex flex-col">
              <h3
                className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Current Stops ({waypoints.length})
              </h3>
              <ul className="space-y-2 overflow-auto pr-1">
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
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="cursor-move text-gray-400">≡</span>
                      <span className="truncate text-sm">
                        {idx + 1}. {wp.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeWaypoint(wp.id)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded-md"
                        title="Remove stop"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
                {waypoints.length === 0 && (
                  <li
                    className={`text-sm px-3 py-4 rounded-lg border text-center ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                  >
                    No stops added yet.
                  </li>
                )}
              </ul>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
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

        {/* Legend for optimized stops */}
        {(totalDistance || totalDuration) && (
          <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-2 p-3 rounded-lg shadow-md bg-white/90 backdrop-blur-sm border border-gray-200">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Route Info</div>
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <span className="font-semibold">{totalDistance}</span>
              <span className="text-gray-400">•</span>
              <span className="font-semibold">{totalDuration}</span>
            </div>
            <hr className="my-1 border-gray-200" />
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-white"></span>
              <span>Fuel Station</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#10b981] border border-white"></span>
              <span>Break Stop</span>
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
