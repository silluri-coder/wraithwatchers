'use client';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold">👻</span>
              </div>
              <span className="text-white font-bold text-lg">WraithWatchers</span>
            </div>
            <p className="text-gray-400 text-sm">
              Tracking spectral encounters across the United States since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  View Sightings
                </a>
              </li>
              <li>
                <a href="/report" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Report Sighting
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-orange-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contact</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Email: sightings@wraithwatchers.org</p>
              <p>Phone: (555) GHOST-01</p>
              <p>Emergency Hotline: 24/7</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 WraithWatchers. All rights reserved. | 
            <span className="ml-2">Investigating the unexplained since 2020</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
