'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { FaMapMarkedAlt, FaRoute, FaUsers, FaGlobeAmericas,  FaInstagram,FaLinkedinIn,FaTwitter,} from 'react-icons/fa';

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
                className='text-gray-900 dark:text-white hover:underline text-sm px-4 py-2 bg-yellow-300 text-white rounded-md'
              >
                Login
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href='/frontend/signuppage' 
                className='hidden md:block text-gray-900 dark:text-white hover:underline text-sm px-4 py-2 bg-transparent border border-yellow-300 text-blue-500 dark:text-blue-300 rounded-md'
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
            Plan Smater, Travel Further.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
          >
            Markdarshan - Your Personalized paths, real-time weather, and cost tracking.
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
              className="inline-block px-8 py-3 bg-yellow-300 text-white rounded-lg font-medium shadow-lg"
            >
              Start Planning
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
              To revolutionize the way people travel by delivering intelligent, personalized, and vehicle-aware journeys — making every trip smarter, safer, and more sustainable.</p>
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
              <div className="text-blue-500 dark:text-yellow-300 text-4xl mb-4">
                <FaMapMarkedAlt />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tech-forward & ambitious</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the leading platform for personalized travel optimization by integrating real-time data, smart routing, and driver-centric tools.
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
              <div className="text-blue-500 dark:text-yellow-300 text-4xl mb-4">
                <FaRoute />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Human-centered</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To empower every traveler with smart tools that adapt to their vehicle, needs, and environment — creating stress-free journeys for all.
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
              <div className="text-blue-500 dark:text-yellow-300 text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sustainability angle</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To optimize travel in a way that reduces fuel waste, enhances safety, and encourages responsible road usage.

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
              Markdarshan : All-in-One Travel Companion 
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
                  <div className="bg-blue-100 dark:bg-yellow-200 p-3 rounded-full">
                    <FaGlobeAmericas className="text-blue-600 dark:text-yellow-700 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vehicle-Aware Routes</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get the shortest and most optimized path based on your vehicle type and fuel range.

                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-yellow-200 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Expense Calculator
</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Estimate trip costs with real-time fuel, toll, and maintenance insights.

                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-yellow-200 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Live Weather Updates</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Stay informed with location-based forecasts and alerts.

                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-yellow-200 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Owner Dashboard
</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Access your saved trips, route history, and personalized suggestions.

                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-yellow-200 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Emergency SOS
</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Quickly send location and alerts to trusted contacts or services.

                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-yellow-200 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Access
</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your data is encrypted and backed by AWS cloud security.

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Markdarshan</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              As travel enthusiasts and technologists, we saw a gap in smart travel planning tools. Traditional apps don’t consider your vehicle’s capabilities, fuel needs, or safety. We built this platform to make travel smarter, more efficient, and safer — tailored just for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Our Story",
                description: "We started with a vision to make travel smarter by tailoring routes to each vehicle’s real-world needs.",
                icon: "📖"
              },
              {
                name: "The Team",
                description: "We're a small group of tech enthusiasts, designers, and travel lovers building with purpose and precision.",
                icon: "👥"
              },
              {
                name: "Technology",
                description: "Powered by Next.js, TypeScript, and AWS, our platform combines smart routing, live weather, cost tracking, and emergency support — all in one place.",
                icon: "💻"
              },
              {
                name: "Community",
                description: "We're creating a growing community of mindful travelers and drivers who care about safer, smarter, and more sustainable journeys.",
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-yellow-300">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Explore?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
              Join millions of users navigating their world with Markdarshan. Sign up today and never get lost again.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/frontend/signuppage" 
                className="px-8 py-3 bg-white text-yellow-300 rounded-lg font-medium shadow-lg"
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
      <footer className="bg-[#0F172A] text-white py-10 px-4 sm:px-10">
        <div className="container px-4 text-center max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
      <h3 className="font-semibold text-lg mb-3">Get in Touch</h3>
      <p className="text-sm leading-6">Have questions or suggestions? Reach out, we’re always listening.</p>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold mb-4">Follow us</h2>
        <div className="flex justify-center gap-6 text-xl">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>

    </div>
    <div>
      <h3 className="font-semibold text-lg mb-3">Features</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="#features" className="hover:underline">Optimized Routes</a></li>
        <li><a href="#pricing" className="hover:underline">Expense Calculator</a></li>
        <li><a href="#api" className="hover:underline">Live Weather</a></li>
        <li><a href="#app" className="hover:underline">Emergency SOS</a></li>
      </ul>
    </div>

    <div>
      <h3 className="font-semibold text-lg mb-3">Company</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="#about" className="hover:underline">About Us</a></li>
        <li><a href="#team" className="hover:underline">Our Team</a></li>
        <li><a href="#careers" className="hover:underline">Careers</a></li>
        <li><a href="#blog" className="hover:underline">Blog</a></li>
      </ul>
    </div>

    
    <div>
      <h3 className="font-semibold text-lg mb-3">📄 Legal</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
        <li><a href="#terms" className="hover:underline">Terms of Service</a></li>
        <li><a href="#cookies" className="hover:underline">Cookie Policy</a></li>
        <li><a href="#gdpr" className="hover:underline">GDPR Compliance</a></li>
      </ul>
    </div>
  </div>

  
  <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-center text-gray-400">
    © 2025 Markdarshan. Built with 🚘 for a smarter journey.
  </div>
</footer>
    </div>
  );
}