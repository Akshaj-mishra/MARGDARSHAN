'use client';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  FaTruckMoving,
  FaMoon,
  FaSun,
  FaRoute,
  FaGasPump,
  FaTruck,
  FaExclamationTriangle,
  FaPlusCircle,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaSync
} from 'react-icons/fa';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');

  // Calculator popup state
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator form state
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('7.5');
  const [fuelPrice, setFuelPrice] = useState('95.0');
  const [otherCosts, setOtherCosts] = useState('');
  const [results, setResults] = useState({ fuelNeeded: '-', fuelCost: '-', totalCost: '-' });

  // State
  const [insights, setInsights] = useState({
    distance: 0,
    fuel: 0,
    spent: 0,
    co2Saved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Theme logic
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode, mounted]);

  const handleThemeToggle = () => {
    setDarkMode(prev => !prev);
  };

  // API call to get trip values
  const getTripInsight = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${baseUrl}/trip_insight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();

      if (!result || result.status !== "success") {
        return { status: "error", data: null };
      }

      return result;

    } catch (error) {
      console.error("getTripInsight error:", error);
      return { status: "error", data: null };
    }
  };

  // Fetch function with loading state
  const fetchStats = async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) {
      setRefreshing(true);
    }
    setLoading(true);

    try {
      const res = await getTripInsight();

      if (res && res.status === "success") {
        const d = res.data;

        setInsights({
          distance: d?.distance || 0,
          fuel: d?.total_fuel || 0,
          spent: d?.total_spent || 0,
          co2Saved: d?.co2 || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      if (showRefreshAnimation) {
        // Keep refresh animation for at least 500ms for better UX
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  // Auto fetch on load (refresh)
  useEffect(() => {
    fetchStats();
  }, []);

  // Handler for My Routes click with refresh
  const handleMyRoutesClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await fetchStats(true);
    // Navigate after refresh
    window.location.href = "../frontend/map_page_main";
  };

  // Handler for manual refresh button (optional)
  const handleManualRefresh = async () => {
    await fetchStats(true);
  };

  const emergencyContacts = [
    { label: 'Police', number: '100' },
    { label: 'Ambulance', number: '102' },
    { label: 'Fire', number: '101' },
    { label: 'Roadside Assistance', number: '18001234567' },
  ];

  const handleEmergencyContactClick = async (number: string, label: string) => {
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|Opera Mini|IEMobile/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      window.location.href = `tel:${number}`;
      return;
    }

    try {
      await navigator.clipboard.writeText(number);
      setEmergencyMessage(`${label} number copied: ${number}`);
      setTimeout(() => setEmergencyMessage(''), 2500);
    } catch {
      setEmergencyMessage(`Unable to copy. Number: ${number}`);
      setTimeout(() => setEmergencyMessage(''), 3000);
    }
  };

  // Calculator handlers
  const handleCalculate = () => {
    const d = parseFloat(distance) || 0;
    const e = parseFloat(efficiency) || 1;
    const fp = parseFloat(fuelPrice) || 0;
    const oc = parseFloat(otherCosts) || 0;

    const fuelNeeded = d / e;
    const fuelCost = fuelNeeded * fp;
    const totalCost = fuelCost + oc;

    setResults({
      fuelNeeded: fuelNeeded ? `${fuelNeeded.toFixed(2)} L` : '-',
      fuelCost: fuelCost ? `₹${fuelCost.toFixed(2)}` : '-',
      totalCost: totalCost ? `₹${totalCost.toFixed(2)}` : '-',
    });

    // Update the Dashboard Insights dynamically
    if (d > 0) {
      setInsights(prev => ({
        ...prev,
        distance: prev.distance + d,
        fuel: prev.fuel + fuelNeeded,
        spent: prev.spent + totalCost,
        co2Saved: prev.co2Saved + (fuelNeeded * 0.23)
      }));
    }
  };

  const handleClear = () => {
    setDistance('');
    setEfficiency('7.5');
    setFuelPrice('95.0');
    setOtherCosts('');
    setResults({ fuelNeeded: '-', fuelCost: '-', totalCost: '-' });
  };

  if (showEmergencyPopup) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-200 relative">
        <div className="flex items-center justify-center h-screen p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-red-600 text-white p-5">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaExclamationTriangle className="text-2xl" />
                Emergency Contacts
              </h2>
            </div>

            <div className="p-5 space-y-3">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.label}
                  type="button"
                  onClick={() => handleEmergencyContactClick(contact.number, contact.label)}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{contact.label}</span>
                    <span className="text-red-600 dark:text-red-400 text-lg font-bold">{contact.number}</span>
                  </div>
                </button>
              ))}

              {emergencyMessage && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{emergencyMessage}</p>
              )}

              <button
                type="button"
                onClick={() => setShowEmergencyPopup(false)}
                className="w-full mt-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 rounded-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-200 relative">
      {/* Embedded Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaTruckMoving className="text-yellow-500 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">Markdarshan</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="border-yellow-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a 
                  href="../frontend/map_page_main" 
                  onClick={handleMyRoutesClick}
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Routes
                </a>
                <div className="flex items-center ml-110 space-x-4">
                  <button
                    onClick={handleThemeToggle}
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    className={`p-2 rounded-full transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </button>
                  <button onClick={() => setShowEmergencyPopup(true)} className="ml-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full text-xl flex items-center shadow-lg">
                    <FaExclamationTriangle className="mr-3 text-2xl" />
                    EMERGENCY SOS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Driver
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Your Intelligent Truck Routing Dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <a 
            href="../frontend/map_page_main" 
            onClick={handleMyRoutesClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRoute className="text-yellow-600 dark:text-yellow-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">My Routes</h3>
            <p className="text-gray-600 dark:text-gray-400">View assigned & active routes</p>
          </a>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGasPump className="text-green-600 dark:text-green-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fuel Calculator</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Estimate trip fuel costs</p>
            <button
              onClick={() => setShowCalculator(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium"
            >
              Open Calculator
            </button>
          </div>

          <a href="../frontend/vehicle_details_page" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTruck className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Automobile Assemblage</h3>
            <p className="text-gray-600 dark:text-gray-400">Your vehicles and their information</p>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <FaTruck className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Assigned Routes</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <FaCheckCircle className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Status</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">On Duty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Insights & Smart Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Trip Insights Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaRoute className="text-yellow-500" /> Trip Insights (Weekly)
              </h3>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className={`p-2 rounded-full transition-all ${
                  refreshing 
                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' 
                    : 'bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                }`}
                title="Refresh trip insights"
              >
                <FaSync className={`text-yellow-600 dark:text-yellow-400 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {loading && !refreshing ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Distance Card */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Distance</p>
                  <p className="text-xl font-bold dark:text-white transition-all">
                    {insights.distance.toLocaleString()} <span className="text-sm font-normal">km</span>
                  </p>
                </div>

                {/* Total Fuel Used Card */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border border-green-100 dark:border-green-800">
                  <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold flex items-center justify-center gap-1">
                    <FaGasPump className="text-[10px]" /> Total Fuel
                  </p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {insights.fuel.toFixed(1)} <span className="text-sm font-normal">L</span>
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 h-1 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-500" 
                      style={{ width: `${Math.min((insights.fuel / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Total Spent Card */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Spent</p>
                  <p className="text-xl font-bold text-yellow-600">
                    ₹{insights.spent.toLocaleString()}
                  </p>
                </div>

                {/* CO2 Saved Card */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">CO₂ Saved</p>
                  <p className="text-xl font-bold text-blue-500">
                    {insights.co2Saved.toFixed(1)} <span className="text-sm font-normal">kg</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Smart Recommendations Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ✨ Smart Insights
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <span className="text-green-600">💰</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Save <strong>₹120/week</strong> by switching to recommended eco-routes.
                </p>
              </div>
              <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                <span className="text-yellow-600">⛽</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Refuel earlier—prices are <strong>5% higher</strong> near your destination.
                </p>
              </div>
              <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                <span className="text-red-600">⚠️</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Pattern Alert: Frequent hard braking detected in urban zones.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Fuel Calculator Modal */}
        {showCalculator && (
          <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCalculator(false); }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-yellow-500 text-white p-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Fuel & Cost Calculator</h3>
                <button 
                  className="text-3xl leading-none hover:opacity-80"
                  onClick={() => setShowCalculator(false)}
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Distance (km)</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={e => setDistance(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter distance in km"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mileage (km/L)</label>
                  <input
                    type="number"
                    value={efficiency}
                    onChange={e => setEfficiency(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="km per liter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fuel Price (₹/L)</label>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={e => setFuelPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Price per liter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Other Costs (₹)</label>
                  <input
                    type="number"
                    value={otherCosts}
                    onChange={e => setOtherCosts(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Tolls, parking, etc."
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Calculate
                </button>

                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl mt-4">
                  <h4 className="font-semibold text-lg mb-3 dark:text-white">Results</h4>
                  <div className="space-y-2 text-gray-800 dark:text-gray-200">
                    <div className="flex justify-between">
                      <span>Fuel Needed:</span>
                      <span className="font-medium">{results.fuelNeeded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Cost:</span>
                      <span className="font-medium">{results.fuelCost}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t dark:border-gray-600 font-bold text-lg">
                      <span>Total Cost:</span>
                      <span>{results.totalCost}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-4 mt-6">
                  <button
                    onClick={handleClear}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-3 rounded-lg font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft /> Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}