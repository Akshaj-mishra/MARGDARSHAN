'use client';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaRoute, FaUsers } from 'react-icons/fa';

export default function VisionSection() {
  const visionItems = [
    {
      icon: <FaMapMarkedAlt className="text-blue-500 dark:text-yellow-300" />,
      title: "Tech-forward & ambitious",
      description: "To become the leading platform for personalized travel optimization by integrating real-time data, smart routing, and driver-centric tools."
    },
    {
      icon: <FaRoute className="text-blue-500 dark:text-yellow-300" />,
      title: "Human-centered",
      description: "To empower every traveler with smart tools that adapt to their vehicle, needs, and environment — creating stress-free journeys for all."
    },
    {
      icon: <FaUsers className="text-blue-500 dark:text-yellow-300" />,
      title: "Sustainability angle",
      description: "To optimize travel in a way that reduces fuel waste, enhances safety, and encourages responsible road usage."
    }
  ];

  return (
    <section id="vision" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount:0.2}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            To revolutionize the way people travel by delivering intelligent, personalized, and vehicle-aware journeys — making every trip smarter, safer, and more sustainable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visionItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}