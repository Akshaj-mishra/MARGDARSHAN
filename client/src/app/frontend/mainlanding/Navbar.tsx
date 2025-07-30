"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  return (
    <nav className="bg-white/80 dark:bg-black backdrop-blur-md fixed w-full z-50">
      <div className="max-w-screen-xl px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 text-gray-900 dark:text-white">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-900 dark:text-amber-300 font-extrabold  font-Yashie_Demoheader text-4xl"
            >
              Markdarshan
            </motion.h1>
            <ul className="hidden md:flex space-x-8 text-sm">
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href="#home"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  Home
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href="#vision"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  Vision
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href="#features"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  Features
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href="#about"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  About
                </a>
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
              {darkMode ? "☀️" : "🌙"}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/frontend/loginpage"
              className="text-gray-900 dark:text-white hover:underline text-sm px-4 py-2 bg-[#FFBE00] text-white rounded-md"
            >
              Login
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/frontend/signuppage"
              className=" md:block text-gray-900 dark:text-white hover:underline text-sm px-2 py-2 bg-transparent border border-yellow-300 text-blue-500 dark:text-blue-300 rounded-md"
            >
              Signup
            </motion.a>
          </div>
        </div>
      </div>
    </nav>
  );
}
