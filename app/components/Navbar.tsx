'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">👻</span>
              </div>
              <span className="text-white font-bold text-xl">WraithWatchers</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-orange-400 transition-colors duration-200"
            >
              Sightings
            </Link>
            <Link 
              href="/report" 
              className="text-white hover:text-orange-400 transition-colors duration-200"
            >
              Report Sighting
            </Link>
            <Link 
              href="/about" 
              className="text-white hover:text-orange-400 transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-orange-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
