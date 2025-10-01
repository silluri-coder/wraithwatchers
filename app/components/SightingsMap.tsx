'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Sighting } from '../utils/supabaseClient';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading map...</p>
      </div>
    </div>
  )
});

// Suppress hydration warnings for the map
if (typeof window !== 'undefined') {
  MapComponent.displayName = 'MapComponent';
}

interface SightingsMapProps {
  sightings: Sighting[];
}

function SightingsMap({ sightings }: SightingsMapProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-white">Sightings Map</h2>
        <div className="text-sm text-gray-400">
          {sightings.length} location{sightings.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="h-[450px] w-full rounded-lg overflow-hidden relative">
        <MapComponent sightings={sightings} />
      </div>
    </div>
  );
}

export default memo(SightingsMap);
