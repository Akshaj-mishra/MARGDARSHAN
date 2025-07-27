'use client';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const aboutItems = [
    {
      name: "Our Story",
      description: "We started with a vision to make travel smarter by tailoring routes to each vehicle's real-world needs.",
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
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount:0.2  }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Margadarshan</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            As travel enthusiasts and technologists, we saw a gap in smart travel planning tools. Traditional apps don't consider your vehicle's capabilities, fuel needs, or safety. We built this platform to make travel smarter, more efficient, and safer — tailored just for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutItems.map((item, index) => (
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
  );
}