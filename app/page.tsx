'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import SightingsStats from './components/SightingsStats';
import SightingsMap from './components/SightingsMap';
import SightingsTable from './components/SightingsTable';
import { loadSightingsData, Sighting } from './utils/supabaseClient';

export default function Home() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredSightings, setFilteredSightings] = useState<Sighting[]>([]);
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  const [selectedApparitionType, setSelectedApparitionType] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading sightings data from Supabase...');
        const startTime = performance.now();
        const data = await loadSightingsData();
        const loadTime = performance.now() - startTime;
        setSightings(data);
        setFilteredSightings(data); // Initialize filtered sightings
        setLoading(false);
        
        // Console log to confirm changes are visible
        console.log('👻 WraithWatchers App Loaded - Total Sightings:', data.length);
        console.log('⏱️ Data loaded in:', Math.round(loadTime), 'ms');
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

  // Memoize recent activity data
  const recentSightings = useMemo(() => sightings.slice(0, 5), [sightings]);
  
  // Memoize apparition types
  const apparitionTypes = useMemo(() => 
    Array.from(new Set(sightings.map(s => s.apparitionType))).slice(0, 6),
    [sightings]
  );
  
  // Memoize apparition counts
  const apparitionCounts = useMemo(() => 
    sightings.reduce((acc, s) => {
      acc[s.apparitionType] = (acc[s.apparitionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    [sightings]
  );

  // Stable callback for filter changes
  const handleFilterChange = useCallback((filtered: Sighting[]) => {
    console.log('Filter changed, updating map with', filtered.length, 'sightings');
    setFilteredSightings(filtered);
  }, []);

  // Handle apparition type filter toggle
  const handleApparitionTypeClick = useCallback((type: string) => {
    setSelectedApparitionType(prev => prev === type ? '' : type);
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
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 py-4">
        {/* Hero Section */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            WraithWatchers
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Tracking spectral encounters across the United States. Explore our database of {sightings.length.toLocaleString()} verified ghost sightings and paranormal activity.
          </p>
        </div>

        {/* Statistics */}
        <SightingsStats sightings={sightings} />

        {/* Map and Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          {/* Map */}
          <div className="lg:col-span-1 xl:col-span-2">
            <SightingsMap sightings={filteredSightings} />
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-[526px]">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-3">Recent Activity</h3>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {recentSightings.map((sighting) => (
                  <div 
                    key={sighting.id} 
                    className="flex items-center justify-between p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedSighting(sighting)}
                  >
                    <div>
                      <p className="text-white font-medium text-sm">{sighting.apparitionType}</p>
                      <p className="text-gray-400 text-xs">{sighting.city}, {sighting.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-xs">{sighting.date}</p>
                      <p className="text-gray-500 text-xs">{sighting.timeOfDay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-3">Apparition Types</h3>
              <div className="grid grid-cols-2 gap-2 content-start overflow-y-auto">
                {apparitionTypes.map((type) => (
                  <div 
                    key={type} 
                    className={`p-2 rounded text-center h-fit cursor-pointer transition-all ${
                      selectedApparitionType === type 
                        ? 'bg-orange-400 border-2 border-orange-500' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => handleApparitionTypeClick(type)}
                  >
                    <p className={`text-xs font-medium ${
                      selectedApparitionType === type ? 'text-black' : 'text-white'
                    }`}>{type}</p>
                    <p className={`text-xs ${
                      selectedApparitionType === type ? 'text-black' : 'text-orange-400'
                    }`}>
                      {apparitionCounts[type]} sightings
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <SightingsTable 
          sightings={sightings} 
          onFilterChange={handleFilterChange}
          externalApparitionFilter={selectedApparitionType}
          onApparitionFilterChange={setSelectedApparitionType}
        />
      </div>

      {/* Sighting Detail Modal */}
      {selectedSighting && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSighting(null)}
        >
          <div 
            className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedSighting.apparitionType}</h2>
                  <p className="text-gray-400">{selectedSighting.city}, {selectedSighting.state}</p>
                </div>
                <button
                  onClick={() => setSelectedSighting(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedSighting.imageLink ? (
                <div className="mb-4">
                  <img 
                    src={selectedSighting.imageLink} 
                    alt={`${selectedSighting.apparitionType} sighting`}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center py-8 text-gray-500">
                    Image not available
                  </div>
                </div>
              ) : (
                <div className="mb-4 bg-gray-800 rounded-lg py-12 text-center text-gray-500">
                  No image available
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-white">{selectedSighting.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Time of Day</p>
                  <p className="text-white">{selectedSighting.timeOfDay}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">{selectedSighting.city}, {selectedSighting.state}</p>
                </div>
                {selectedSighting.notes && (
                  <div>
                    <p className="text-gray-400 text-sm">Notes</p>
                    <p className="text-white">{selectedSighting.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}