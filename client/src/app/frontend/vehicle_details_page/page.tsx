"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { Truck, Plus, ChevronDown, ChevronUp } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Vehicle {
  id?: string;
  name: string;
  vehicleType: string;
  engineCapacity: string;
  fuelCapacity: string;
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
  const [fuelCapacity, setFuelCapacity] = useState("60");
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

  const [isDark, setIsDark] = useState(false);

  const [vehicleProfiles, setVehicleProfiles] = useState<Vehicle[]>([]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

      document.documentElement.classList.toggle("dark", shouldBeDark);
      setIsDark(shouldBeDark);
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
    let computedTyres = "";
    if (vehicleType === "Two wheeler") {
      genWeight = "150";
      genHeight = "1.1";
      computedTyres = "2";
    } else if (vehicleType === "Three wheeler") {
      genWeight = "350";
      genHeight = "1.7";
      computedTyres = "3";
    } else if (vehicleType === "Four wheeler") {
      genWeight = "1200";
      genHeight = "1.5";
      computedTyres = "4";
    } else if (vehicleType === "Heavy vehicle") {
      genWeight = "36287";
      genHeight = "4.1";
      computedTyres = "6";
    }

    const vehicleData: Vehicle = {
      name,
      vehicleType,
      engineCapacity: capacity,
      fuelCapacity,
      weight: weight.trim() || genWeight,
      height: genHeight,
      milage,
      noTyres: computedTyres,
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
      fuelCapacity,
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
    setFuelCapacity("60");
    setPayloadWeight("");
    setPayloadHeight("");
    setWeight("");
    setHeight("");
    setVehicleType("");
    setMilage("");
    setNoTyres("");
  };

  const themedLabelClass = `mb-1.5 block text-sm font-medium ${
    isDark ? "text-zinc-200" : "text-zinc-700"
  }`;
  const themedInputClass = `w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
    isDark
      ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:bg-zinc-900"
      : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white"
  }`;

  return (
    <div
      className={`min-h-screen px-3 py-5 sm:px-6 sm:py-8 lg:px-10 ${
        isDark
          ? "bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950"
          : "bg-gradient-to-br from-amber-50 via-white to-zinc-100"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`mb-4 rounded-3xl p-4 backdrop-blur-xl sm:mb-6 sm:p-6 ${
            isDark
              ? "border border-white/10 bg-white/5"
              : "border border-zinc-200 bg-white/80"
          }`}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
                Fleet Management
              </p>
              <h1
                className={`mt-2 text-2xl font-semibold sm:text-4xl ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Vehicle Details
              </h1>
              <p
                className={`mt-2 text-sm leading-relaxed sm:text-base ${
                  isDark ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                Add and manage your vehicle profiles.
              </p>
            </div>
            <div
              className={`hidden rounded-2xl p-3 sm:block ${
                isDark ? "bg-yellow-400/10" : "bg-yellow-100"
              }`}
            >
              <Truck className="h-7 w-7 text-yellow-300" />
            </div>
          </div>
        </div>

        {error && (
          <div
            className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-medium sm:mb-5 ${
              isDark
                ? "border-red-400/40 bg-red-500/10 text-red-200"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <section
            className={`rounded-3xl border p-4 shadow-2xl sm:p-8 ${
              isDark
                ? "border-zinc-700 bg-zinc-900 shadow-black/30"
                : "border-white/10 bg-white shadow-black/20"
            }`}
          >
            <h2
              className={`text-xl font-semibold sm:text-2xl ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              Add Vehicle
            </h2>
            <p className={`mt-1 text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Fill in basic and optional information.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g., MH12 AB 4567"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                    isDark
                      ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:bg-zinc-900"
                      : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white"
                  }`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Engine Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g., 1500 cc"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:bg-zinc-900"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Fuel Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g., 60 L"
                    value={fuelCapacity}
                    onChange={(e) => setFuelCapacity(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:bg-zinc-900"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Vehicle Mileage</label>
                  <input
                    type="text"
                    placeholder="e.g., 12 km/l"
                    value={milage}
                    onChange={(e) => setMilage(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:bg-zinc-900"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Vehicle Weight (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., 1200 kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:bg-zinc-900"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`mb-2 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Vehicle Type</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {["Two wheeler", "Three wheeler", "Four wheeler", "Heavy vehicle"].map((type) => (
                    <label
                      key={type}
                      className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                        vehicleType === type
                          ? isDark
                            ? "border-yellow-500 bg-yellow-500/10 text-zinc-100"
                            : "border-yellow-400 bg-yellow-50 text-zinc-900"
                          : isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500"
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
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition ${
                  isDark
                    ? "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showAdvanced && (
                <div className={`grid gap-4 rounded-2xl border p-4 sm:grid-cols-2 ${isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-50"}`}>
                  <div>
                    <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Additional Payload Weight</label>
                    <input
                      type="text"
                      placeholder="e.g., 250 kg"
                      value={payload_weight}
                      onChange={(e) => setPayloadWeight(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                        isDark
                          ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                          : "border-zinc-200 bg-white text-zinc-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Additional Payload Height</label>
                    <input
                      type="text"
                      placeholder="e.g., 0.4 m"
                      value={payload_height}
                      onChange={(e) => setPayloadHeight(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 ${
                        isDark
                          ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                          : "border-zinc-200 bg-white text-zinc-900"
                      }`}
                    />
                  </div>
                </div>
              )}

              <button
                className={`w-full min-h-12 rounded-xl px-4 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDark
                    ? "bg-yellow-500 text-zinc-900 hover:bg-yellow-400"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}
                onClick={saveVehicle}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Vehicle"}
              </button>
            </div>
          </section>

          <section
            className={`rounded-3xl border p-4 shadow-2xl sm:p-8 ${
              isDark
                ? "border-zinc-700 bg-zinc-900 shadow-black/30"
                : "border-white/10 bg-white shadow-black/20"
            }`}
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className={`text-xl font-semibold sm:text-2xl ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>Vehicle Profiles</h3>
                <p className={`mt-1 text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Select a profile to edit or delete.</p>
              </div>
              <button
                className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                  isDark
                    ? "border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
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
                      setFuelCapacity((v.fuelCapacity || "").replace(/[^0-9.]/g, "") || "60");
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
              <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-500"}`}>Loading vehicles...</p>
            )}

            {!isLoading && vehicleProfiles.length === 0 && (
              <div className={`rounded-2xl border border-dashed p-8 text-center ${isDark ? "border-zinc-600 bg-zinc-800" : "border-zinc-300 bg-zinc-50"}`}>
                <p className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-500"}`}>No vehicles yet. Add your first vehicle profile.</p>
              </div>
            )}

            <div className="space-y-3">
              {vehicleProfiles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id || null)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedVehicle === vehicle.id
                      ? isDark
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-yellow-400 bg-yellow-50"
                      : isDark
                        ? "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
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
                        <Truck className={`h-4 w-4 ${isDark ? "text-zinc-300" : "text-zinc-600"}`} />
                        <span className={`font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{vehicle.name}</span>
                      </div>
                      <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
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
                          className={`min-h-10 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                            isDark
                              ? "border-red-500/40 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
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
            <div className={`max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border p-4 pb-6 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl sm:p-8 ${isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white"}`}>
              <h3 className={`text-xl font-semibold sm:text-2xl ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>Edit Vehicle</h3>
              <p className={`mt-1 text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Update the selected vehicle profile.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={themedLabelClass}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={themedInputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={themedLabelClass}>Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className={themedInputClass}
                  >
                    <option value="">Select Type</option>
                    <option value="Two wheeler">Two wheeler</option>
                    <option value="Three wheeler">Three wheeler</option>
                    <option value="Four wheeler">Four wheeler</option>
                    <option value="Heavy vehicle">Heavy vehicle</option>
                  </select>
                </div>

                <div>
                  <label className={themedLabelClass}>Height (in meters)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Weight (in kgs)</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Engine Capacity (in cc)</label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Fuel Capacity (in liters)</label>
                  <input
                    type="text"
                    value={fuelCapacity}
                    onChange={(e) => setFuelCapacity(e.target.value)}
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Vehicle Mileage (in km/l)</label>
                  <input
                    type="text"
                    value={milage}
                    onChange={(e) => setMilage(e.target.value)}
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Number of Tyres</label>
                  <input
                    type="text"
                    value={noTyres}
                    onChange={(e) => setNoTyres(e.target.value)}
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Additional Payload Weight (in kgs)</label>
                  <input
                    type="text"
                    value={payload_weight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPayloadWeight(e.target.value)
                    }
                    className={themedInputClass}
                  />
                </div>
                <div>
                  <label className={themedLabelClass}>Additional Payload Height (in meters)</label>
                  <input
                    type="text"
                    value={payload_height}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPayloadHeight(e.target.value)
                    }
                    className={themedInputClass}
                  />
                </div>
              </div>

              <div className={`sticky bottom-0 mt-6 flex gap-2 border-t pt-3 ${isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white"}`}>
                <button
                  className={`min-h-11 flex-1 rounded-xl border px-4 py-2 font-medium transition disabled:opacity-50 ${isDark ? "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className={`min-h-11 flex-1 rounded-xl px-4 py-2 font-medium transition disabled:opacity-50 ${isDark ? "bg-yellow-500 text-zinc-900 hover:bg-yellow-400" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}
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
