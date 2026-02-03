"use client";

import React, { useState, useEffect } from "react";
import { Truck, Plus, ChevronDown, ChevronUp } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Vehicle {
  id?: string;
  name: string;
  vehicleType: string;
  engineCapacity: string;
  weight: string;
  height: string;
  additionalPayloadWeight?: string;
  additionalPayloadHeight?: string;
}

const Vehicle_details = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [payload_weight, setPayloadWeight] = useState("");
  const [payload_height, setPayloadHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicleProfiles, setVehicleProfiles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      setVehicleProfiles(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  const saveVehicle = async () => {
    if (!name.trim()) {
      setError("Vehicle name is required");
      return;
    }
    if (!vehicleType) {
      setError("Vehicle type is required");
      return;
    }

    let genWeight = "";
    let genHeight = "";
    if (vehicleType === "Two wheeler") {
      genWeight = "150";
      genHeight = "1.1";
    } else if (vehicleType === "Three wheeler") {
      genWeight = "350";
      genHeight = "1.7";
    } else if (vehicleType === "Heavy vehicle") {
      genWeight = "36287";
      genHeight = "4.1";
    }

    const vehicleData: Vehicle = {
      name,
      vehicleType,
      engineCapacity: capacity,
      weight: genWeight,
      height: genHeight,
      additionalPayloadWeight: payload_weight,
      additionalPayloadHeight: payload_height,
    };

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });
      if (!response.ok) throw new Error("Failed to save vehicle");

      resetForm();
      await fetchVehicles();
    } catch (err) {
      console.error("Error saving vehicle:", err);
      setError("Failed to save vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async () => {
    if (!editVehicleId || !name.trim()) {
      setError("Vehicle name is required");
      return;
    }

    const vehicleData: Vehicle = {
      name,
      vehicleType,
      engineCapacity: capacity,
      weight,
      height,
      additionalPayloadWeight: payload_weight,
      additionalPayloadHeight: payload_height,
    };

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE_URL}/vehicles/${editVehicleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleData),
        },
      );
      if (!response.ok) throw new Error("Failed to update vehicle");

      setIsEditing(false);
      resetForm();
      await fetchVehicles();
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setError("Failed to update vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete vehicle");

      await fetchVehicles();
      setSelectedVehicle(null);
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Failed to delete vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCapacity("");
    setPayloadWeight("");
    setPayloadHeight("");
    setWeight("");
    setHeight("");
    setVehicleType("");
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="bg-black text-white p-4 pt-8 border-b border-gray-800">
        <h1 className="text-xl font-bold">MarkDarshan</h1>
        <p className="text-gray-400 text-sm">Vehicle details page</p>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 m-4 rounded-lg">{error}</div>
      )}

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-black">Add vehicle</h2>
          <div className="space-y-3">
            <div className="relative">
              <h3 className="mb-2 text-black font-medium">Vehicle name</h3>
              <input
                type="text"
                placeholder="Vehicle name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-black placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <h3 className="mb-2 text-black font-medium">Engine Capacity</h3>
              <input
                type="text"
                placeholder="Engine Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-black placeholder-gray-500"
              />
            </div>

            <h3 className="mb-2 text-black font-medium">Vehicle Type</h3>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="vehicleType"
                  checked={vehicleType === "Two wheeler"}
                  onChange={() => setVehicleType("Two wheeler")}
                  className="rounded text-yellow-500 focus:ring-yellow-400"
                />
                <span className="text-sm text-black">Two wheeler</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="vehicleType"
                  checked={vehicleType === "Three wheeler"}
                  onChange={() => setVehicleType("Three wheeler")}
                  className="rounded text-yellow-500 focus:ring-yellow-400"
                />
                <span className="text-sm text-black">Three Wheeler</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="vehicleType"
                  checked={vehicleType === "Heavy vehicle"}
                  onChange={() => setVehicleType("Heavy vehicle")}
                  className="rounded text-yellow-500 focus:ring-yellow-400"
                />
                <span className="text-sm text-black">
                  Heavy vehicle (Trucks or buses)
                </span>
              </label>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-black text-sm font-medium hover:text-gray-700 transition-colors"
            >
              Advance Options
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </button>

            {showAdvanced && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="relative">
                  <h3 className="mb-2 text-black font-medium">
                    Additional Payload weight
                  </h3>
                  <input
                    type="text"
                    placeholder="Additional Payload weight"
                    value={payload_weight}
                    onChange={(e) => setPayloadWeight(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-black placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <h3 className="mb-2 text-black font-medium">
                    Additional payload height
                  </h3>
                  <input
                    type="text"
                    placeholder="Additional payload height"
                    value={payload_height}
                    onChange={(e) => setPayloadHeight(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-black placeholder-gray-500"
                  />
                </div>
              </div>
            )}

            <button
              className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
              onClick={saveVehicle}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Vehicle"}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">
              Vehicle Profile
            </h3>
            <button
              className="text-yellow-600 text-sm font-medium hover:text-yellow-700 transition-colors disabled:opacity-50"
              onClick={() => {
                if (selectedVehicle !== null) {
                  setIsEditing(true);
                  setEditVehicleId(selectedVehicle);
                  const v = vehicleProfiles.find(
                    (veh) => veh.id === selectedVehicle,
                  );
                  if (v) {
                    setName(v.name);
                    setHeight(v.height.replace(/[^0-9.]/g, ""));
                    setWeight(v.weight.replace(/[^0-9.]/g, ""));
                    setCapacity(v.engineCapacity.replace(/[^0-9.]/g, ""));
                    setPayloadWeight(
                      (v.additionalPayloadWeight || "").replace(/[^0-9.]/g, ""),
                    );
                    setPayloadHeight(
                      (v.additionalPayloadHeight || "").replace(/[^0-9.]/g, ""),
                    );
                    setVehicleType(v.vehicleType);
                  }
                }
              }}
              disabled={selectedVehicle === null || isLoading}
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Edit Vehicle details
            </button>
          </div>

          {isLoading && vehicleProfiles.length === 0 && (
            <p className="text-gray-500">Loading vehicles...</p>
          )}

          <div className="space-y-2">
            {vehicleProfiles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id || null)}
                className={`w-full p-3 rounded-xl border text-left transition-colors ${
                  selectedVehicle === vehicle.id
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="font-medium text-black">
                        {vehicle.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {vehicle.height} • {vehicle.weight} •{" "}
                      {vehicle.engineCapacity}
                      {vehicle.additionalPayloadWeight &&
                        ` • ${vehicle.additionalPayloadWeight}`}
                      {vehicle.additionalPayloadHeight &&
                        ` • ${vehicle.additionalPayloadHeight}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedVehicle === vehicle.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVehicle(vehicle.id || "");
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    )}
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedVehicle === vehicle.id
                          ? "border-yellow-500 bg-yellow-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedVehicle === vehicle.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {isEditing && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 w-96 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold text-black mb-4">
                  Edit Vehicle
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    >
                      <option value="">Select Type</option>
                      <option value="Two wheeler">Two wheeler</option>
                      <option value="Three wheeler">Three wheeler</option>
                      <option value="Heavy vehicle">Heavy vehicle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Height (in meters)
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Weight (in kgs)
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Engine Capacity (in cc)
                    </label>
                    <input
                      type="text"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Additional Payload Weight (in kgs)
                    </label>
                    <input
                      type="text"
                      value={payload_weight}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPayloadWeight(e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Additional Payload Height (in meters)
                    </label>
                    <input
                      type="text"
                      value={payload_height}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPayloadHeight(e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-black"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className="px-4 py-2 rounded-xl bg-gray-200 text-black font-medium disabled:opacity-50"
                      onClick={() => {
                        setIsEditing(false);
                        resetForm();
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-yellow-500 text-white font-medium disabled:opacity-50"
                      onClick={updateVehicle}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicle_details;
