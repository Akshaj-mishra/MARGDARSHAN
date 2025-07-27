'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
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
          Plan Smarter, Travel Further.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
        >
          Margadarshan - Your Personalized paths, real-time weather, and cost tracking.
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
  );
}