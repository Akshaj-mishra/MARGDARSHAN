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
  FaArrowLeft
} from 'react-icons/fa';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Calculator popup state
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator form state
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('7.5');
  const [fuelPrice, setFuelPrice] = useState('95.0');
  const [otherCosts, setOtherCosts] = useState('');
  const [results, setResults] = useState({ fuelNeeded: '-', fuelCost: '-', totalCost: '-' });

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
  };

  const handleClear = () => {
    setDistance('');
    setEfficiency('7.5');
    setFuelPrice('95.0');
    setOtherCosts('');
    setResults({ fuelNeeded: '-', fuelCost: '-', totalCost: '-' });
  };

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
                <a href="../frontend/map_page_main/map_page" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  My Routes
                </a>
                <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Documents
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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

              <a 
                href="/frontend/loginpage" 
                className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Login
              </a>
              <a 
                href="/frontend/signuppage" 
                className="px-4 py-2 text-sm font-medium rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Sign Up
              </a>
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

        {/* Emergency SOS */}
        <div className="mb-10 text-center">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-10 rounded-full text-xl flex items-center justify-center mx-auto animate-pulse shadow-lg">
            <FaExclamationTriangle className="mr-3 text-2xl" /> 
            EMERGENCY SOS
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <a href="/routes-planner" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
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

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTruck className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Current Route</h3>
            <p className="text-gray-600 dark:text-gray-400">Live tracking & status</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <FaRoute className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Routes</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <FaExclamationTriangle className="text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Pending Issues</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
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