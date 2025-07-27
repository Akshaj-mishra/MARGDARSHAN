'use client';
import { useState } from 'react';

export default function Navbar() {
    return (
        <nav className="bg-gray-50 dark:bg-gray-700">
            <div className="max-w-screen-xl px-4 py-6 mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-gray-900 dark:text-white font-bold ">Margadashan</h1>
                        <ul className="flex space-x-8 text-sm">
                            <li>
                                <a href="#" className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-900 dark:text-white hover:underline">Vision</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-900 dark:text-white hover:underline">Features</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-900 dark:text-white hover:underline">About</a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex space-x-4">
                        <a href='/frontend/loginpage' className='text-gray-900 dark:text-white hover:underline text-sm'>Login</a>
                        <a href='/frontend/signuppage' className='text-gray-900 dark:text-white hover:underline text-sm'>Signup</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}