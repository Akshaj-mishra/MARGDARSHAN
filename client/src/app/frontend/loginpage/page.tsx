'use client';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaSignInAlt } from 'react-icons/fa';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover filter blur(4px)">
        <source src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4" type="video/mp4" />Video not supported
      </video>
      <div className=" rounded-2xl p-8 w-full max-w-sm shadow-xl relative text-white">
        <button className="absolute top-3 right-4 text-white text-lg">✕</button>

        <h2 className="text-2xl font-bold text-center mb-1">Login</h2>
        <p className="text-center text-sm mb-6 text-gray-400">
          Welcome back! Please sign in to continue
        </p>

        <form className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email ID"
              className="w-full rounded-full bg-black border border-gray-600 px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full rounded-full bg-black border border-gray-600 px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>

          <div className="text-right text-sm">
            <a href="#" className="text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="button"
            className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold py-2 rounded-full flex items-center justify-center space-x-2"
          >
            <FaGoogle />
            <span>Login with Google</span>
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>Login</span>
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{' '}
          <a href="#" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}