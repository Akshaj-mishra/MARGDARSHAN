'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUser, FaGoogle } from 'react-icons/fa';
import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [firebaseError, setFirebaseError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword:
          value !== formData.confirmPassword ? 'Passwords do not match' : '',
      }));
    }

    if (name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password ? 'Passwords do not match' : '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseError('');
    setLoading(true);

    if (errors.password || errors.confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      router.push('/frontend/mainlanding');
    } catch (error: any) {
      console.error('Signup error:', error);
      setFirebaseError('Unable to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    setFirebaseError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      router.push('/frontend/mainlanding');
    } catch (error: any) {
      console.error('Google Signup error:', error);
      setFirebaseError('Unable to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center w-full bg-gradient-to-br from-gray-900 to-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover filter blur-[10px]"
      >
        <source
          src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4"
          type="video/mp4"
        />
        Video not supported
      </video>

      <div className="relative z-10 w-full max-w-md rounded-2xl p-8 shadow-xl bg-black/70 text-white">
        <button
          onClick={() => router.push('/frontend/mainlanding')}
          className="absolute top-3 right-4 text-white text-lg"
        >
          ✕
        </button>

        <h1 className="text-center text-3xl font-bold mb-2">Markdarshan</h1>
        <p className="text-center text-sm mb-6 text-gray-300">
          Welcome to the beta! Enter your details to sign up
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your Username"
              className="w-full rounded-full bg-black border border-gray-600 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-full rounded-full bg-black border border-gray-600 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`w-full rounded-full bg-black border py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              }`}
              required
              minLength={8}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 ml-2">{errors.password}</p>
          )}

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={`w-full rounded-full bg-black border py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 ml-2">{errors.confirmPassword}</p>
          )}

          {firebaseError && (
            <p className="text-xs text-center text-red-500">{firebaseError}</p>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              !!errors.password ||
              !!errors.confirmPassword ||
              !formData.password ||
              !formData.confirmPassword
            }
            className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold py-2 rounded-full transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="flex items-center justify-center space-x-2 text-white">
            <div className="h-px flex-1 bg-gray-500"></div>
            <span className="px-2 text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-500"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold py-2 rounded-full flex items-center justify-center space-x-2 transition duration-200"
          >
            <FaGoogle className="text-red-500" />
            <span>{loading ? 'Please wait...' : 'Sign up with Google'}</span>
          </button>

          <p className="text-center text-sm mt-4 text-gray-300">
            Already have an account?{' '}
            <a
              href="/frontend/loginpage"
              className="text-blue-400 hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
