'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReportSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 border-4 border-green-500 rounded-full">
            <svg 
              className="w-12 h-12 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Sighting Reported Successfully!
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Thank you for contributing to the WraithWatchers database. Your paranormal encounter has been recorded.
        </p>

        {/* Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">What happens next?</h2>
          <div className="text-left space-y-3 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-orange-400 mt-1">✓</span>
              <p>Your sighting has been added to our database</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-400 mt-1">✓</span>
              <p>It will appear on the map and in the sightings table</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-400 mt-1">✓</span>
              <p>Other users can now view your reported experience</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-400 mt-1">✓</span>
              <p>Our team may review and verify the information</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link 
            href="/"
            className="inline-block bg-orange-400 hover:bg-orange-500 text-black font-medium px-8 py-3 rounded transition-colors"
          >
            View All Sightings
          </Link>
          <Link 
            href="/report"
            className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded transition-colors"
          >
            Report Another Sighting
          </Link>
        </div>

        {/* Auto-redirect Notice */}
        <p className="text-gray-500 text-sm">
          Redirecting to homepage in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
