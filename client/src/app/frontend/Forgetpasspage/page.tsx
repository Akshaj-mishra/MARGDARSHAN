'use client';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaSignInAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router=useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover filter blur[10px]">
        <source src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4" type="video/mp4" />Video not supported
      </video>
      <div className=" rounded-2xl p-8 w-full max-w-sm shadow-xl relative text-white">
        <button onClick={()=>router.push('/frontend/mainlanding')} className="absolute top-3 right-4 text-white text-lg">✕</button>

        <h2 className="text-2xl font-bold text-center mb-1">Find Your Account</h2>
        <p className="text-center text-sm mb-6 text-gray-400">
          Enter your email address or username.
        </p>

        <form className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email ID or username"
              className="w-full rounded-full bg-black border border-gray-600 px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          
          

          

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-full flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>Continue</span>
          </button>
        </form>

        
      </div>
    </div>
  );
}