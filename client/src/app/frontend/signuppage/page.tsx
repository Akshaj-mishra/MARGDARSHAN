// app/signup/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUser, FaGoogle } from 'react-icons/fa';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    const validatePassword = (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            setErrors(prev => ({
                ...prev,
                password: validatePassword(value),
                confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : ''
            }));
        }

        if (name === 'confirmPassword') {
            setErrors(prev => ({
                ...prev,
                confirmPassword: value !== formData.password ? 'Passwords do not match' : ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (errors.password || errors.confirmPassword) return;

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Sign up failed');
            }
        } catch (error) {
            console.error('Sign up error:', error);
            alert('An error occurred during sign up');
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden w-full bg-gray-100 dark:bg-gray-900">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover filter "
            >
                <source src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4" type="video/mp4" />
                Video not supported
            </video>
                <div className="relative z-10 w-11/12 max-w-md rounded-xl  p-8 shadow-lg  ">
                <button onClick={()=>router.push('/frontend/landing')} className="absolute top-3 right-4 text-white text-lg">✕</button>
                    <h1 className="mb-6 text-center text-4xl font-bold text-gray-800 dark:text-white">Markdarshan</h1>
                    <p className="mb-6 text-center text-lg text-gray-600 dark:text-gray-300">Welcome to the beta! Enter your details to sign up</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your Username"
                                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400"
                                required
                            />
                        </div>

                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your Email"
                                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400"
                                required
                            />
                        </div>

                        <div className="relative mb-4">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className={`w-full rounded-full border py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                minLength={8}
                                required
                            />
                            
                        </div>
                                    {errors.password && (
                                <p className="ml-3 text-xs text-red-500 h-4">{errors.password}</p>
                            )}
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={`w-full rounded-full border py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            
                        </div>
                                    {errors.confirmPassword && (
                                <p className="mt-1 ml-3 text-xs text-red-500">{errors.confirmPassword}</p>
                            )}
                        <button
                            type="submit"
                            className="w-full rounded-full bg-orange-400 py-2 px-4 font-bold text-gray-900 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:ring-offset-2 "
                            disabled={!!errors.password || !!errors.confirmPassword || !formData.password || !formData.confirmPassword}
                        >
                            Sign Up
                        </button>

                        <div className="flex items-center justify-center space-x-2">
                            <div className="h-px flex-1 bg-gray-300"></div>
                            <span className="px-2 text-sm text-BLUE">OR</span>
                            <div className="h-px flex-1 bg-gray-300"></div>
                        </div>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center space-x-2 rounded-full border bg-blue-600 border-gray-300 py-2 px-4 text-gray-700 hover:bg-blue-700 dark:border-gray-600 dark:text-gray-300 "
                        >
                            <FaGoogle className="text-red-500" />
                            <span>Sign up with Google</span>
                        </button>

                        <p className="text-center text-sm text-gray-600 dark:text-black">
                            Already have an account?{' '}
                            <a href="/frontend/loginpage" className="text-blue-600 font-bold hover:underline dark:text-blue-95000">
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
        </div>
    );
}