'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Sighting } from '../utils/supabaseClient';
import { useEffect, useMemo, useRef, useState } from 'react';

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

// Component to handle "Go to Current Location" button
function CurrentLocationControl() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const goToCurrentLocation = () => {
    if (!map) return;
    
    setLocating(true);
    map.locate({ setView: true, maxZoom: 12 });
    
    map.once('locationfound', () => {
      setLocating(false);
    });
    
    map.once('locationerror', () => {
      setLocating(false);
      alert('Unable to get your location. Please check browser permissions.');
    });
  };

  useEffect(() => {
    // Ensure map is ready
    if (!map) return;
  }, [map]);

  if (!map) return null;

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '80px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={goToCurrentLocation}
          disabled={locating}
          className="bg-white hover:bg-gray-100 p-2 rounded shadow-lg disabled:opacity-50 border-2 border-gray-200"
          title="Go to my location"
          style={{
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: locating ? 'wait' : 'pointer',
          }}
        >
          {locating ? '⌛' : '📍'}
        </button>
      </div>
    </div>
  );
}

// Custom component to handle marker clustering with proportional sizes
function MarkerClusterLayer({ sightings }: { sightings: Sighting[] }) {
  const map = useMap();
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  // Group sightings by location to determine counts
  const locationGroups = useMemo(() => {
    if (!sightings || sightings.length === 0) return [];
    
    const groups = new Map<string, { sightings: Sighting[]; lat: number; lng: number }>();
    
    sightings.forEach((sighting) => {
      if (!sighting.latitude || !sighting.longitude) return; // Skip invalid coordinates
      
      const key = `${sighting.latitude.toFixed(4)},${sighting.longitude.toFixed(4)}`;
      if (!groups.has(key)) {
        groups.set(key, {
          sightings: [],
          lat: sighting.latitude,
          lng: sighting.longitude
        });
      }
      groups.get(key)!.sightings.push(sighting);
    });
    
    return Array.from(groups.values());
  }, [sightings]);

  // Create icon with size proportional to sighting count
  const createProportionalIcon = (count: number) => {
    // Calculate size based on count (min 20, max 50)
    const baseSize = 20;
    const sizeIncrement = Math.min(count * 3, 30); // Max additional 30px
    const size = baseSize + sizeIncrement;
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size * 1.6}" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#FF9F40" stroke="#000" stroke-width="1.5"/>
          <circle cx="8" cy="10" r="2" fill="#000"/>
          <circle cx="17" cy="10" r="2" fill="#000"/>
          <path d="M8 15 Q12.5 18 17 15" stroke="#000" stroke-width="2" fill="none"/>
          ${count > 1 ? `<text x="12.5" y="28" text-anchor="middle" fill="#000" font-size="6" font-weight="bold">${count}</text>` : ''}
        </svg>
      `)}`,
      iconSize: [size, size * 1.6],
      iconAnchor: [size / 2, size * 1.6],
      popupAnchor: [0, -(size * 1.6)]
    });
  };

  useEffect(() => {
    if (!map) {
      console.log('Map not ready yet');
      return;
    }

    // If no location groups, just return (empty map)
    if (!locationGroups || locationGroups.length === 0) {
      console.log('No location groups to display');
      return;
    }

    console.log('Setting up markers for', locationGroups.length, 'location groups');

    const setupMarkers = () => {
      // Remove existing cluster layer if any
      if (markerClusterGroupRef.current) {
        try {
          map.removeLayer(markerClusterGroupRef.current);
        } catch (e) {
          console.log('No existing layer to remove');
        }
        markerClusterGroupRef.current = null;
      }

      // Create marker cluster group with custom settings
      const markerClusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let size = 'small';
          if (count > 100) size = 'large';
          else if (count > 50) size = 'medium';
          
          return L.divIcon({
            html: `<div class="cluster-icon cluster-${size}">
              <span class="ghost-emoji">👻</span>
              <span class="cluster-count">${count}</span>
            </div>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(40, 40, true)
          });
        }
      });

      // Add markers for each location group with proportional sizing
      let markersAdded = 0;
      locationGroups.forEach((location) => {
        try {
          const count = location.sightings.length;
          const marker = L.marker([location.lat, location.lng], {
            icon: createProportionalIcon(count)
          });

          // Create popup content
          const popupContent = count > 1 ? `
            <div style="padding: 8px; min-width: 250px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #1a1a1a;">${count} Sightings at this location</h3>
              <div style="font-size: 14px; line-height: 1.5;">
                <p><strong>Location:</strong> ${location.sightings[0].city}, ${location.sightings[0].state}</p>
                <p style="color: #4a5568; margin-top: 8px; font-size: 12px;">Click to zoom in and see individual sightings</p>
              </div>
            </div>
          ` : `
            <div style="padding: 8px; min-width: 250px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #1a1a1a;">${location.sightings[0].apparitionType}</h3>
              <div style="font-size: 14px; line-height: 1.5;">
                <p><strong>Location:</strong> ${location.sightings[0].city}, ${location.sightings[0].state}</p>
                <p><strong>Date:</strong> ${location.sightings[0].date}</p>
                <p><strong>Time:</strong> ${location.sightings[0].timeOfDay}</p>
                <p style="color: #4a5568; margin-top: 8px;">${location.sightings[0].notes}</p>
                ${location.sightings[0].imageLink ? `<img src="${location.sightings[0].imageLink}" alt="Evidence" style="width: 100%; height: 128px; object-fit: cover; border-radius: 4px; margin-top: 8px;" />` : ''}
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          markerClusterGroup.addLayer(marker);
          markersAdded++;
        } catch (error) {
          console.error('Error adding marker:', error, location);
        }
      });

      console.log('Added', markersAdded, 'markers to cluster group');

      // Add cluster group to map when ready
      try {
        map.addLayer(markerClusterGroup);
        markerClusterGroupRef.current = markerClusterGroup;
        console.log('Cluster group added to map successfully');
      } catch (error) {
        console.error('Error adding cluster group to map:', error);
      }
    };

    // Wait for map to be ready before adding markers
    if (map.getContainer()) {
      // Map container exists, safe to add markers
      map.whenReady(() => {
        setupMarkers();
      });
    } else {
      console.log('Map container not ready yet');
    }

    // Cleanup function
    return () => {
      if (markerClusterGroupRef.current && map) {
        try {
          map.removeLayer(markerClusterGroupRef.current);
        } catch (e) {
          console.log('Error during cleanup:', e);
        }
      }
    };
  }, [map, locationGroups]);

  return null;
}

export default function MapComponent({ sightings }: MapComponentProps) {
  console.log('🗺️ MapComponent loaded with', sightings?.length || 0, 'sightings');

  // Handle empty sightings gracefully
  if (!sightings || sightings.length === 0) {
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          maxZoom={18}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="grayscale"
          />
          <CurrentLocationControl />
        </MapContainer>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #374151',
          zIndex: 1000
        }}>
          <p className="text-gray-300 text-sm">No sightings match the current filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <MapContainer
      center={[39.8283, -98.5795]} // Center of US
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
        maxZoom={18}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="grayscale"
      />
        <MarkerClusterLayer sightings={sightings} />
        <CurrentLocationControl />
      </MapContainer>
      
      <style jsx global>{`
        .custom-marker-cluster {
          background: transparent;
        }
        
        .cluster-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FF9F40 0%, #FF6B35 100%);
          border: 3px solid #000;
          border-radius: 50%;
          color: #000;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(255, 159, 64, 0.5);
        }
        
        .cluster-small {
          width: 40px;
          height: 40px;
        }
        
        .cluster-medium {
          width: 50px;
          height: 50px;
        }
        
        .cluster-large {
          width: 60px;
          height: 60px;
        }
        
        .ghost-emoji {
          font-size: 1.2em;
          line-height: 1;
        }
        
        .cluster-count {
          font-size: 0.7em;
          font-weight: bold;
        }

        .marker-cluster-small {
          background-color: rgba(255, 159, 64, 0.6);
        }
        
        .marker-cluster-medium {
          background-color: rgba(255, 107, 53, 0.6);
        }
        
        .marker-cluster-large {
          background-color: rgba(255, 87, 34, 0.6);
        }

        .marker-cluster {
          background-clip: padding-box;
          border-radius: 20px;
        }
        
        .marker-cluster div {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          border-radius: 15px;
          font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
        }
        
        .marker-cluster span {
          line-height: 30px;
        }
      `}</style>
    </>
  );
}