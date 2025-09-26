'use client';

import dynamic from 'next/dynamic';
import { Sighting } from '../utils/csvParser';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading map...</p>
      </div>
    </div>
  )
});

interface SightingsMapProps {
  sightings: Sighting[];
}

export default function SightingsMap({ sightings }: SightingsMapProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Sightings Map</h2>
      <div className="h-96 w-full rounded-lg overflow-hidden">
        <MapComponent sightings={sightings} />
      </div>
    </div>
  );
}
