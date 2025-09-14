'use client';
import Navbar from './Navbar';
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

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);}

  // Mounted flag to avoid mismatches during hydration
  const [mounted, setMounted] = useState(false);
  // Ref to track if Tailwind CSS is injected
  const tailwindInjectedRef = useRef(false);

  // Inline Tailwind CSS - Injected inside the component to avoid hook errors
  const inlineTailwindCSS = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      html {
        @apply bg-gray-100 dark:bg-gray-900;
      }
    }
  `;

  // Inject Tailwind CSS inline (moved inside component)
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || tailwindInjectedRef.current) return;

    // Remove existing style tag if any
    const existing = document.getElementById('tailwind-inline');
    if (existing) existing.remove();

    // Create new style tag
    const style = document.createElement('style');
    style.id = 'tailwind-inline';
    style.textContent = inlineTailwindCSS;
    document.head.appendChild(style);

    tailwindInjectedRef.current = true;
  }, []);

  // Apply initial theme synchronously before paint to avoid flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = localStorage.getItem('theme'); // 'dark' | 'light' | null
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedTheme === 'System' || (!savedTheme && systemPrefersDark);

      setDarkMode(initialDark);
      document.documentElement.classList.toggle('dark', initialDark);
    } catch (e) {
      // Ignore storage errors
    } finally {
      setMounted(true);
    }
  }, []);

  // Keep localStorage in sync if darkMode changes after mount
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch (e) {}
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode, mounted]);

  // Toggle theme handler
  const handleThemeToggle = () => {
    setDarkMode(prev => !prev);
  };

  // Calculator popup state
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator form state
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('7.5');
  const [fuelPrice, setFuelPrice] = useState('95.0');
  const [otherCosts, setOtherCosts] = useState('');
  const [results, setResults] = useState({ fuelNeeded: '-', fuelCost: '-', totalCost: '-' });

  // Calculator logic
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
    <div className="bg-gray-100 dark:bg-[#6A6767] min-h-screen transition-colors duration-200 relative">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {/* Navbar */}
      {/* <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaTruckMoving className="text-orange-500 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">Markdarshan</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" className="border-orange-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</a>
                <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Fleet</a>
                <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Routes</a>
                <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Analytics</a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={handleThemeToggle}
                  title={darkMode ? 'Switch to light' : 'Switch to dark'}
                  aria-label="Toggle theme"
                  aria-pressed={darkMode}
                  className={`p-2 rounded-full focus:outline-none transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                </button>
                <a href="/frontend/loginpage" className="ml-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">Login</a>
                <a href="/frontend/signuppage" className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600">Sign Up</a>
              </div>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#6A6767] ">
        {/* Welcome Section */}
        <div className="mb-8 text-center p-15">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to <div className="ml-4 mr-4 inline-block text-yellow-300 font-Yashie_Demo">
           Markdarshan</div></h1>
          <p className="mt-2 text-lg text-gray-900 dark:text-gray-400">Your Intelligent Truck Routing and Fleet Management System</p>
        </div>

        

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <a href="/routes-planner" className="route-card bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow block">
            <div className="bg-blue-100 dark:bg-yellow-100/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRoute className="text-yellow-300 dark:text-yellow-300 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Plan Routes</h3>
            <p className="text-gray-500 dark:text-gray-400">Create optimized routes for your fleet</p>
          </a>

          <div className="bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow">
            <div className="bg-yellow-100 dark:bg-yellow-100/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGasPump className="text-yellow-300 dark:text-yellow-300 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Fuel Calculator</h3>
            <p className="text-gray-500 dark:text-gray-400">Calculate fuel costs for your trips</p>
            <button
              className="mt-4 bg-yellow-300 cursor-pointer hover:bg-yellow-300 text-yellow-700 py-2 px-4 rounded-lg text-sm"
              onClick={() => setShowCalculator(true)}
            >
              Open Calculator
            </button>
          </div>

          <div className="bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow">
            <div className="bg-yellow-100 dark:bg-yellow-100/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTruck className="text-yellow-300 dark:text-yellow-300 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Fleet Overview</h3>
            <p className="text-gray-500 dark:text-gray-400">Monitor your entire fleet in real-time</p>
          </div>
        </div>

        {/* Stats Overview with Edit Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaPlusCircle />
            </button>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-100/30 text-yellow-300 dark:text-yellow-300">
                <FaTruck className="text-xl text-yellow-300 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Vehicles</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">42</p>
              </div>
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaEdit />
            </button>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-100/30 text-yellow-300 dark:text-yellow-300">
                <FaCheckCircle className="text-xl text-yellow-300 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Vehicles</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
              </div>
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaEdit />
            </button>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-100/30 text-yellow-300 dark:text-yellow-300">
                <FaRoute className="text-xl text-yellow-300 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Routes</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
              </div>
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-[#2e2d2d] rounded-lg shadow p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaEdit />
            </button>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-100/30 text-yellow-300 dark:text-yellow-300">
                <FaExclamationTriangle className="text-xl text-yellow-300 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Issues</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="bg-white dark:bg-[#2e2d2d] rounded-lg shadow mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">On-time Delivery Rate</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">87%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Efficiency</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-300 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">7.2 mpg</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Utilization</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-900 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">65%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-center ">
              <div className="text-center p-6 bg-gray-50 dark:bg-[#181818] rounded-lg w-full">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Routes Overview</h4>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Completed Today:</span>
                  <span className="font-medium text-gray-900 dark:text-white">12 routes</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">In Progress:</span>
                  <span className="font-medium text-gray-900 dark:text-white">8 routes</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Scheduled:</span>
                  <span className="font-medium text-gray-900 dark:text-white">6 routes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Delayed:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">2 routes</span>
                </div>
                <a href="/routes" className="mt-6 inline-block bg-yellow-300 hover:bg-yellow-300 text-yellow-700 py-2 px-4 rounded-lg text-sm">
                  View All Routes
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-[#2e2d2d] rounded-lg shadow mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
            <a href="/activities" className="text-sm text-orange-600 hover:text-orange-500 font-medium">View All</a>
          </div>
          <div className="p-4">
            <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-yellow-300 dark:bg-yellow-100/30 p-2 rounded-full">
                <FaCheckCircle className="text-yellow-700 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">Delivery completed</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Truck #TRK-542 reached Mumbai warehouse</p>
              </div>
              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">10 mins ago</div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-yellow-300 dark:bg-yellow-100/30 p-2 rounded-full">
                <FaRoute className="text-yellow-700 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">New route assigned</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Route from Delhi to Jaipur assigned to Truck #TRK-312</p>
              </div>
              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">45 mins ago</div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-yellow-100 dark:bg-yellow-100/30 p-2 rounded-full">
                <FaClock className="text-yellow-700 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">Delay reported</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Truck #TRK-127 delayed by 45 minutes due to traffic</p>
              </div>
              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">1 hour ago</div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-yellow-100 dark:bg-yellow-100/30 p-2 rounded-full">
                <FaGasPump className="text-yellow-700 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">Fuel refill completed</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Truck #TRK-218 refueled at HP petrol pump, Ahmedabad</p>
              </div>
              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">2 hours ago</div>
            </div>

            <div className="flex items-center py-3">
              <div className="bg-yellow-100 dark:bg-yellow-100/30 p-2 rounded-full">
                <FaExclamationTriangle className="text-yellow-700 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">Vehicle issue reported</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Truck #TRK-218 reported brake issues near Ahmedabad</p>
              </div>
              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">3 hours ago</div>
            </div>
          </div>
        </div>
      </main>

      {/* Calculator Popup */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setShowCalculator(false); }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-grey-800 text-black p-4 rounded-t-lg  flex justify-between items-center">
              <h3 className="font-semibold">Fuel & Cost Calculator</h3>
              <button className="text-black cursor-pointer text-2xl" onClick={() => setShowCalculator(false)}>&times;</button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance (km)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={e => setDistance(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Enter distance"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mileage (km/L)</label>
                <input
                  type="number"
                  value={efficiency}
                  onChange={e => setEfficiency(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  placeholder="km per liter"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Price (per liter)</label>
                <input
                  type="number"
                  value={fuelPrice}
                  onChange={e => setFuelPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Price per liter"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Costs</label>
                <input
                  type="number"
                  value={otherCosts}
                  onChange={e => setOtherCosts(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Tolls, maintenance, etc."
                />
              </div>

              <button
                className="w-full bg-yellow-300 hover:bg-yellow-500 cursor-pointer text-white py-2 rounded-lg mb-4"
                onClick={handleCalculate}
              >
                Calculate
              </button>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2 dark:text-white">Results:</h4>
                <div className="flex justify-between mb-1 dark:text-gray-300">
                  <span>Fuel Needed:</span>
                  <span>{results.fuelNeeded}</span>
                </div>
                <div className="flex justify-between mb-1 dark:text-gray-300">
                  <span>Fuel Cost:</span>
                  <span>{results.fuelCost}</span>
                </div>
                <div className="flex justify-between font-bold dark:text-white">
                  <span>Total Cost:</span>
                  <span>{results.totalCost}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  className="bg-gray-300 cursor-pointer dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-white py-2 px-4 rounded-lg"
                  onClick={handleClear}
                >
                  Clear
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}