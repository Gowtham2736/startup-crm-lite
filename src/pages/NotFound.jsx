import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
      <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition">
        Go Back Home
      </Link>
    </div>
  );
}
