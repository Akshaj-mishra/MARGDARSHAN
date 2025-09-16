"use client";
import { motion } from "framer-motion";
import ToggleMode from "../../component/ToggleMode";

export default function Navbar() {
  return (
    <nav className="bg-white/80 dark:bg-black backdrop-blur-md fixed w-full z-50">
      <div className="max-w-screen-xl px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 text-gray-900 dark:text-white">
            <p>Status:On Duty</p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-900 dark:text-amber-300 font-extrabold font-Yashie_Demoheader text-4xl"
            >
              Markdarshan
            </motion.h1>
            <ul className="hidden md:flex mx-100 space-x-8 text-sm  text-red-800 dark:text-color-red-800 font-semibold">
              {["Emergency SOS"].map((link) => (
                <motion.li key={link} whileHover={{ scale: 1.05 }}>
                  <a
                    href={`#${link}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <ToggleMode />
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/frontend/loginpage"
              className="px-4 py-2 text-sm rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
            >
              Login
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/frontend/signuppage"
              className="px-4 py-2 text-sm rounded-md border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Signup
            </motion.a>
            
          </div>
        </div>
      </div>
    </nav>
  );
}
