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
  milage: string;
  noTyres: string;
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
  const [milage, setMilage] = useState("");
  const [noTyres, setNoTyres] = useState("");

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
    if (!milage.trim()) {
      setError("Vehicle milage is required");
      return;
    }
    if (!vehicleType) {
      setError("Vehicle type is required");
      return;
    }

    let genWeight = "";
    let genHeight = "";
    let noTyres = "";
    if (vehicleType === "Two wheeler") {
      genWeight = "150";
      genHeight = "1.1";
      noTyres = "2";
    } else if (vehicleType === "Three wheeler") {
      genWeight = "350";
      genHeight = "1.7";
      noTyres = "3";
    } else if (vehicleType === "Four wheeler") {
      genWeight = "1200";
      genHeight = "1.5";
      noTyres = "4";
    } else if (vehicleType === "Heavy vehicle") {
      genWeight = "36287";
      genHeight = "4.1";
      noTyres = "6";
    }

    const vehicleData: Vehicle = {
      name,
      vehicleType,
      engineCapacity: capacity,
      weight: genWeight,
      height: genHeight,
      milage,
      noTyres,
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
      milage,
      noTyres,
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
    setMilage("");
    setNoTyres("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950 px-3 py-5 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:mb-6 sm:p-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-400/90">
                Fleet Management
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-4xl">
                Vehicle Details
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Add and manage your vehicle profiles.
              </p>
            </div>
            <div className="hidden rounded-2xl bg-yellow-400/10 p-3 sm:block">
              <Truck className="h-7 w-7 text-yellow-300" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 sm:mb-5">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <section className="rounded-3xl border border-white/10 bg-white p-4 shadow-2xl shadow-black/20 sm:p-8">
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Add Vehicle</h2>
            <p className="mt-1 text-sm text-zinc-500">Fill in basic and optional information.</p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g., MH12 AB 4567"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Engine Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g., 1500 cc"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Vehicle Mileage</label>
                  <input
                    type="text"
                    placeholder="e.g., 12 km/l"
                    value={milage}
                    onChange={(e) => setMilage(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Vehicle Type</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {["Two wheeler", "Three wheeler", "Four wheeler", "Heavy vehicle"].map((type) => (
                    <label
                      key={type}
                      className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                        vehicleType === type
                          ? "border-yellow-400 bg-yellow-50 text-zinc-900"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="vehicleType"
                        checked={vehicleType === type}
                        onChange={() => setVehicleType(type)}
                        className="h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                      />
                      {type === "Heavy vehicle" ? "Heavy vehicle (Trucks or buses)" : type}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showAdvanced && (
                <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">Additional Payload Weight</label>
                    <input
                      type="text"
                      placeholder="e.g., 250 kg"
                      value={payload_weight}
                      onChange={(e) => setPayloadWeight(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">Additional Payload Height</label>
                    <input
                      type="text"
                      placeholder="e.g., 0.4 m"
                      value={payload_height}
                      onChange={(e) => setPayloadHeight(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200"
                    />
                  </div>
                </div>
              )}

              <button
                className="w-full min-h-12 rounded-xl bg-zinc-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={saveVehicle}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Vehicle"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white p-4 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Vehicle Profiles</h3>
                <p className="mt-1 text-sm text-zinc-500">Select a profile to edit or delete.</p>
              </div>
              <button
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
                      setMilage((v.milage || "").replace(/[^0-9.]/g, ""));
                      setNoTyres((v.noTyres || "").replace(/[^0-9]/g, ""));
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
                <Plus className="mr-1 h-4 w-4" />
                Edit Selected
              </button>
            </div>

            {isLoading && vehicleProfiles.length === 0 && (
              <p className="rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-500">Loading vehicles...</p>
            )}

            {!isLoading && vehicleProfiles.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                <p className="text-sm text-zinc-500">No vehicles yet. Add your first vehicle profile.</p>
              </div>
            )}

            <div className="space-y-3">
              {vehicleProfiles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id || null)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedVehicle === vehicle.id
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedVehicle(vehicle.id || null);
                    }
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-zinc-600" />
                        <span className="font-semibold text-zinc-900">{vehicle.name}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                        {vehicle.vehicleType} • {vehicle.height} • {vehicle.weight} • {vehicle.engineCapacity} • {vehicle.milage || "N/A"} km/l • {vehicle.noTyres || "N/A"} tyres
                        {vehicle.additionalPayloadWeight && ` • ${vehicle.additionalPayloadWeight}`}
                        {vehicle.additionalPayloadHeight && ` • ${vehicle.additionalPayloadHeight}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      {selectedVehicle === vehicle.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteVehicle(vehicle.id || "");
                          }}
                          className="min-h-10 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      )}
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          selectedVehicle === vehicle.id
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-zinc-300"
                        }`}
                      >
                        {selectedVehicle === vehicle.id && (
                          <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
            <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white p-4 pb-6 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl sm:p-8">
              <h3 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Edit Vehicle</h3>
              <p className="mt-1 text-sm text-zinc-500">Update the selected vehicle profile.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  >
                    <option value="">Select Type</option>
                    <option value="Two wheeler">Two wheeler</option>
                    <option value="Three wheeler">Three wheeler</option>
                    <option value="Four wheeler">Four wheeler</option>
                    <option value="Heavy vehicle">Heavy vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Height (in meters)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Weight (in kgs)</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Engine Capacity (in cc)</label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Vehicle Mileage (in km/l)</label>
                  <input
                    type="text"
                    value={milage}
                    onChange={(e) => setMilage(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Number of Tyres</label>
                  <input
                    type="text"
                    value={noTyres}
                    onChange={(e) => setNoTyres(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Additional Payload Weight (in kgs)</label>
                  <input
                    type="text"
                    value={payload_weight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPayloadWeight(e.target.value)
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Additional Payload Height (in meters)</label>
                  <input
                    type="text"
                    value={payload_height}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPayloadHeight(e.target.value)
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 mt-6 flex gap-2 border-t border-zinc-200 bg-white pt-3">
                <button
                  className="min-h-11 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="min-h-11 flex-1 rounded-xl bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
                  onClick={updateVehicle}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicle_details;
