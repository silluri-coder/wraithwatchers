'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Sighting } from '../utils/csvParser';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  sightings: Sighting[];
}

export default function MapComponent({ sightings }: MapComponentProps) {
  // Console log to confirm map component is loading
  console.log('🗺️ MapComponent loaded with', sightings.length, 'sightings');
  console.log('📍 First few locations:', sightings.slice(0, 3).map(s => `${s.city}, ${s.state}`));

  // Group sightings by location to create clusters
  const locationGroups = sightings.reduce((groups, sighting) => {
    const key = `${sighting.latitude.toFixed(3)},${sighting.longitude.toFixed(3)}`;
    if (!groups[key]) {
      groups[key] = {
        lat: sighting.latitude,
        lng: sighting.longitude,
        sightings: [],
        count: 0
      };
    }
    groups[key].sightings.push(sighting);
    groups[key].count++;
    return groups;
  }, {} as Record<string, { lat: number; lng: number; sightings: Sighting[]; count: number }>);

  const locationArray = Object.values(locationGroups);

  // Console log clustering information
  console.log('🗺️ Created', locationArray.length, 'location clusters from', sightings.length, 'sightings');
  console.log('📊 Cluster distribution:', {
    single: locationArray.filter(l => l.count === 1).length,
    multiple: locationArray.filter(l => l.count > 1).length,
    maxCluster: Math.max(...locationArray.map(l => l.count))
  });

  // Custom ghost marker icon with size scaling
  const createGhostIcon = (apparitionType: string, count: number, zoomLevel: number) => {
    const colors = {
      'Shadow Figure': '#6E6E6E',
      'White Lady': '#F8F8F8',
      'Poltergeist': '#FF9F40',
      'Orbs': '#FF9F40',
      'Headless Spirit': '#6E6E6E',
      'Phantom Sounds': '#F8F8F8',
      'Full-Body Apparition': '#F8F8F8'
    };

    const color = colors[apparitionType as keyof typeof colors] || '#F8F8F8';
    
    // Scale size based on count and zoom level
    const baseSize = Math.max(15, Math.min(50, 20 + (count * 2)));
    const zoomFactor = Math.max(0.5, Math.min(2, zoomLevel / 6));
    const size = Math.round(baseSize * zoomFactor);
    
    // Create a more prominent marker for clusters
    const isCluster = count > 1;
    const clusterColor = isCluster ? '#FF9F40' : color;
    const strokeWidth = isCluster ? '2' : '1';
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size * 1.6}" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${clusterColor}" stroke="#000" stroke-width="${strokeWidth}"/>
          <circle cx="8" cy="10" r="2" fill="#000"/>
          <circle cx="17" cy="10" r="2" fill="#000"/>
          <path d="M8 15 Q12.5 18 17 15" stroke="#000" stroke-width="2" fill="none"/>
          ${isCluster ? `<text x="12.5" y="25" text-anchor="middle" fill="#000" font-size="8" font-weight="bold">${count}</text>` : ''}
        </svg>
      `)}`,
      iconSize: [size, size * 1.6],
      iconAnchor: [size / 2, size * 1.6],
      popupAnchor: [0, -(size * 1.6)]
    });
  };

  return (
    <MapContainer
      center={[39.8283, -98.5795]} // Center of US
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="grayscale"
      />
      {locationArray.map((location, index) => {
        // Get the most common apparition type for this location
        const apparitionCounts = location.sightings.reduce((acc, sighting) => {
          acc[sighting.apparitionType] = (acc[sighting.apparitionType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostCommonType = Object.entries(apparitionCounts)
          .sort(([,a], [,b]) => b - a)[0][0];
        
        return (
          <Marker
            key={`${location.lat}-${location.lng}-${index}`}
            position={[location.lat, location.lng]}
            icon={createGhostIcon(mostCommonType, location.count, 4)} // Default zoom level
          >
            <Popup>
              <div className="p-2 min-w-[250px] max-w-[300px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">
                    {location.count > 1 ? `${location.count} Sightings` : mostCommonType}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {location.sightings[0].city}, {location.sightings[0].state}
                  </span>
                </div>
                
                {location.count > 1 ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Apparition Types:</strong>
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {Object.entries(apparitionCounts).map(([type, count]) => (
                        <span key={type} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                          {type} ({count})
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Click to see individual sightings below
                    </p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Type:</strong> {mostCommonType}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Time:</strong> {location.sightings[0].timeOfDay}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{location.sightings[0].notes}</p>
                  </div>
                )}
                
                {/* Show individual sightings */}
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {location.sightings.slice(0, location.count > 1 ? 3 : 1).map((sighting, idx) => (
                    <div key={idx} className="border-t pt-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-800">{sighting.date}</span>
                        <span className="text-xs text-gray-600">{sighting.timeOfDay}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{sighting.notes}</p>
                      {sighting.imageLink && (
                        <img 
                          src={sighting.imageLink} 
                          alt="Sighting evidence" 
                          className="w-full h-16 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  ))}
                  {location.count > 3 && (
                    <p className="text-xs text-gray-500 italic">
                      ... and {location.count - 3} more sightings
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
