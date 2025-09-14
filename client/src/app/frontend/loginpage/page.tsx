'use client';

import { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaSignInAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

const firebaseErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-disabled': 'This user has been disabled.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/popup-closed-by-user': 'Sign in popup closed before completing.',
  // Add other relevant Firebase error codes and messages here if you want
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getFriendlyErrorMessage = (errorCode: string) => {
    return firebaseErrorMessages[errorCode] || 'Login failed. Please try again.';
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/frontend/mainlanding');
    } catch (err: any) {
      // Extract Firebase error code and map it
      const code = err.code || '';
      setError(getFriendlyErrorMessage(code));
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError('');
    try {
      await signInWithPopup(auth, provider);
      router.push('/frontend/mainlanding');
    } catch (err: any) {
      const code = err.code || '';
      setError(getFriendlyErrorMessage(code));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover filter blur-[10px]"
      >
        <source src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4" type="video/mp4" />
        Video not supported
      </video>

      <div className="rounded-2xl p-8 w-full max-w-sm shadow-xl relative text-white bg-black/70 z-10">
        <button
          onClick={() => router.push('/frontend/mainlanding')}
          className="absolute top-3 right-4 text-white text-lg"
          aria-label="Close login form"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">Login</h2>
        <p className="text-center text-sm mb-6 text-gray-400">
          Welcome back! Please sign in to continue
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email ID"
              className="w-full rounded-full bg-black border border-gray-600 px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              pattern=".{8,15}"
              minLength={8}
              maxLength={15}
              title="Password must be between 8 to 15 characters."
              className="w-full rounded-full bg-black border border-gray-600 px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer select-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>

          {/* Forgot password */}
          <div className="text-right text-sm">
            <a href="/frontend/Forgetpasspage" className="text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Google login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold py-2 rounded-full flex items-center justify-center space-x-2"
          >
            <FaGoogle className="text-red-500" />
            <span>Login with Google</span>
          </button>

          {/* Email login button */}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-full flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>Login</span>
          </button>
        </form>

        {/* Error display */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {/* Sign up link */}
        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Don’t have an account?{' '}
          <a href="/frontend/signuppage" className="text-blue-600 hover:underline dark:text-blue-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
