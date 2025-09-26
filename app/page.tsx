'use client';

import { useState, useEffect } from 'react';
import SightingsStats from './components/SightingsStats';
import SightingsMap from './components/SightingsMap';
import SightingsTable from './components/SightingsTable';
import { loadSightingsData, Sighting } from './utils/csvParser';

export default function Home() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading sightings data from CSV...');
        const data = await loadSightingsData();
        setSightings(data);
        setLoading(false);
        
        // Console log to confirm changes are visible
        console.log('👻 WraithWatchers App Loaded - Total Sightings:', data.length);
        console.log('🗺️ Map markers updated with locations:', data.slice(0, 5).map(s => `${s.city}, ${s.state}`));
        console.log('📊 Apparition types distribution:', data.reduce((acc, s) => {
          acc[s.apparitionType] = (acc[s.apparitionType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>));
      } catch (err) {
        console.error('Error loading sightings data:', err);
        setError('Failed to load sightings data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading WraithWatchers</h2>
          <p className="text-gray-400">Fetching spectral encounter data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-400 hover:bg-orange-500 text-black px-6 py-2 rounded font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            WraithWatchers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tracking spectral encounters across the United States. Explore our database of {sightings.length.toLocaleString()} verified ghost sightings and paranormal activity.
          </p>
        </div>

        {/* Statistics */}
        <SightingsStats sightings={sightings} />

        {/* Map and Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Map */}
          <div className="lg:col-span-1">
            <SightingsMap sightings={sightings} />
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {sightings.slice(0, 5).map((sighting) => (
                  <div key={sighting.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <p className="text-white font-medium">{sighting.apparitionType}</p>
                      <p className="text-gray-400 text-sm">{sighting.city}, {sighting.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">{sighting.date}</p>
                      <p className="text-gray-500 text-xs">{sighting.timeOfDay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Apparition Types</h3>
              <div className="grid grid-cols-2 gap-3">
                {Array.from(new Set(sightings.map(s => s.apparitionType))).slice(0, 6).map((type) => (
                  <div key={type} className="bg-gray-800 p-3 rounded text-center">
                    <p className="text-white text-sm font-medium">{type}</p>
                    <p className="text-orange-400 text-xs">
                      {sightings.filter(s => s.apparitionType === type).length} sightings
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <SightingsTable sightings={sightings} />
      </div>
    </div>
  );
}