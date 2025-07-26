'use client'; // Required for client-side interactivity

import { useState } from 'react';

export default function SignUpPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    const validatePassword = (value) => {
        if (value.length < 8) {
            return 'Password must be at least 8 characters';
        }
        return '';
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors({
            ...errors,
            password: validatePassword(value),
        });
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setErrors({
            ...errors,
            confirmPassword: value !== password ? 'Passwords do not match' : '',
        });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden w-full">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover filter blur-sm" // Changed to Tailwind's blur-sm
            >
                <source src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4" type="video/mp4" />
                Video not supported
            </video>

            <div className="relative z-10 w-11/12 max-w-sm rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900 sm:max-w-md">
                <h1 className="mb-6 text-center text-4xl font-bold dark:text-white">MARGADARSHAN</h1>
                <p className="mb-6 text-center text-1xl font-bold dark:text-white">Welcome to the beta! Enter your email to sign in</p>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your Username"
                            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email-Id
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your Email-Id"
                            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password (min 8 characters)"
                            className={`w-full rounded-md border p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            minLength={8}
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm your password"
                            className={`w-full rounded-md border p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded bg-[#F7CE4C] px-4 py-2 font-bold text-white hover:bg-[#e6b921] focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:ring-offset-2 disabled:opacity-50"
                        disabled={!!errors.password || !!errors.confirmPassword || !password || !confirmPassword}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}