'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaRoute, FaUsers, FaGlobeAmericas } from 'react-icons/fa';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-screen-xl px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gray-900 dark:text-white font-bold text-xl"
              >
                Margadashan
              </motion.h1>
              <ul className="hidden md:flex space-x-8 text-sm">
                <motion.li whileHover={{ scale: 1.05 }}>
                  <a href="#home" className="text-gray-900 dark:text-white hover:underline">Home</a>
                </motion.li>
                <motion.li whileHover={{ scale: 1.05 }}>
                  <a href="#vision" className="text-gray-900 dark:text-white hover:underline">Vision</a>
                </motion.li>
                <motion.li whileHover={{ scale: 1.05 }}>
                  <a href="#features" className="text-gray-900 dark:text-white hover:underline">Features</a>
                </motion.li>
                <motion.li whileHover={{ scale: 1.05 }}>
                  <a href="#about" className="text-gray-900 dark:text-white hover:underline">About</a>
                </motion.li>
              </ul>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                {darkMode ? '☀️' : '🌙'}
              </motion.button>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href='/frontend/loginpage' 
                className='text-gray-900 dark:text-white hover:underline text-sm px-4 py-2 bg-blue-500 text-white rounded-md'
              >
                Login
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href='/frontend/signuppage' 
                className='hidden md:block text-gray-900 dark:text-white hover:underline text-sm px-4 py-2 bg-transparent border border-blue-500 text-blue-500 dark:text-blue-300 rounded-md'
              >
                Signup
              </motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/OJO4YQ0.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Discover Your World
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
          >
            Margadarshan - Your ultimate mapping and navigation companion
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/frontend/signuppage" 
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg"
            >
              Get Started
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              To revolutionize the way people navigate and explore their world through intuitive mapping technology that's accessible to everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md"
            >
              <div className="text-blue-500 dark:text-blue-400 text-4xl mb-4">
                <FaMapMarkedAlt />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Mapping</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed maps covering every corner of your world with real-time updates.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md"
            >
              <div className="text-blue-500 dark:text-blue-400 text-4xl mb-4">
                <FaRoute />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Navigation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Intelligent routing that adapts to traffic, weather, and your preferences.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md"
            >
              <div className="text-blue-500 dark:text-blue-400 text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built by and for users who contribute to make our maps better every day.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Margadarshan comes packed with features designed to make your navigation experience seamless and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Map Interface" 
                className="rounded-xl shadow-xl"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <FaGlobeAmericas className="text-blue-600 dark:text-blue-300 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Global Coverage</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Access detailed maps for virtually any location worldwide, from bustling cities to remote trails.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get live traffic data, road closures, and incident reports to plan the optimal route.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Offline Access</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Download maps for offline use when you're traveling in areas with poor connectivity.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Margadarshan</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Learn more about the team and technology behind your favorite mapping application.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Our Story",
                description: "Founded in 2023 with a mission to make navigation accessible to everyone, everywhere.",
                icon: "📖"
              },
              {
                name: "The Team",
                description: "A diverse group of cartographers, engineers, and designers passionate about maps.",
                icon: "👥"
              },
              {
                name: "Technology",
                description: "Cutting-edge mapping algorithms combined with community-sourced data for accuracy.",
                icon: "💻"
              },
              {
                name: "Community",
                description: "Millions of users worldwide contributing to make our maps better every day.",
                icon: "🌍"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Explore?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
              Join millions of users navigating their world with Margadarshan. Sign up today and never get lost again.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/frontend/signuppage" 
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg"
              >
                Get Started for Free
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#features" 
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium"
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Margadarshan</h3>
              <p className="mb-4">Your ultimate mapping and navigation companion.</p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
                  <motion.a 
                    key={index}
                    whileHover={{ y: -3 }}
                    href="#"
                    className="text-gray-400 hover:text-white"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'API', 'Apps'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Press'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Cookie Policy', 'GDPR'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2023 Margadarshan. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}