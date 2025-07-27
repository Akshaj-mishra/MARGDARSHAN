'use client';
import { motion } from 'framer-motion';

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-yellow-300">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount:0.2}}
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
  );
}