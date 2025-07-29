'use client';
import { FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-10 px-4 sm:px-10">
      <div className="container px-4 text-center max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-3">Get in Touch</h3>
          <p className="text-sm leading-6">Have questions or suggestions? Reach out, we're always listening.</p>
          <div className="container mx-auto px-4 text-center mt-4">
            <h2 className="text-lg font-semibold mb-4">Follow us</h2>
            <div className="flex justify-center gap-6 text-xl">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">
                <FaLinkedinIn />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-3">Features</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:underline hover:text-yellow-300 transition-colors">Optimized Routes</a></li>
            <li><a href="#features" className="hover:underline hover:text-yellow-300 transition-colors">Expense Calculator</a></li>
            <li><a href="#features" className="hover:underline hover:text-yellow-300 transition-colors">Live Weather</a></li>
            <li><a href="#features" className="hover:underline hover:text-yellow-300 transition-colors">Emergency SOS</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:underline hover:text-yellow-300 transition-colors">About Us</a></li>
            <li><a href="#about" className="hover:underline hover:text-yellow-300 transition-colors">Our Team</a></li>
            <li><a href="#careers" className="hover:underline hover:text-yellow-300 transition-colors">Careers</a></li>
            <li><a href="#blog" className="hover:underline hover:text-yellow-300 transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">📄 Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#privacy" className="hover:underline hover:text-yellow-300 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:underline hover:text-yellow-300 transition-colors">Terms of Service</a></li>
            <li><a href="#cookies" className="hover:underline hover:text-yellow-300 transition-colors">Cookie Policy</a></li>
            <li><a href="#gdpr" className="hover:underline hover:text-yellow-300 transition-colors">GDPR Compliance</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-center text-gray-400">
        © 2025 Markdarshan. Built for 🚘 for a smarter journey.
      </div>
    </footer>
  );
}