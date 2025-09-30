'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

export default function ReportSighting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    sighting_date: '',
    city: '',
    state: '',
    notes: '',
    time_of_day: 'Night',
    apparition_tag: 'Shadow Figure',
    image_url: ''
  });

  const apparitionTypes = [
    'Shadow Figure',
    'White Lady',
    'Poltergeist',
    'Orbs',
    'Headless Spirit',
    'Phantom Sounds',
    'Full-Body Apparition'
  ];

  const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night', 'Dawn', 'Dusk'];

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    
    // Trigger geocoding when both city and state are manually filled
    if (name === 'city' || name === 'state') {
      const updatedFormData = { ...formData, [name]: value };
      if (updatedFormData.city && updatedFormData.state) {
        geocodeLocation(updatedFormData.city, updatedFormData.state);
      }
    }
  };

  const geocodeLocation = async (city: string, state: string) => {
    if (!city || !state) return;
    
    setGettingLocation(true);
    setError(null);
    
    try {
      const query = encodeURIComponent(`${city}, ${state}, USA`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=us`,
        {
          headers: {
            'User-Agent': 'WraithWatchers/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({
          lat: parseFloat(lat),
          lng: parseFloat(lon)
        });
        setLocationDetected(true);
        console.log('✓ Location geocoded:', { lat, lon });
      } else {
        setError(`Could not find coordinates for ${city}, ${state}. Please check the spelling.`);
        setCoordinates(null);
        setLocationDetected(false);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setCoordinates(null);
      setLocationDetected(false);
    } finally {
      setGettingLocation(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({
          lat: latitude,
          lng: longitude
        });

        // Reverse geocode to get city and state
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'WraithWatchers/1.0'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            
            const city = address.city || address.town || address.village || address.county || '';
            const state = address.state || '';
            
            setFormData(prev => ({
              ...prev,
              city: city,
              state: state
            }));
            
            setLocationDetected(true);
            console.log('✓ Location detected:', { lat: latitude, lng: longitude, city, state });
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          // Still keep coordinates even if reverse geocoding fails
        }

        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please check your browser permissions.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.sighting_date || !formData.city || !formData.state || !formData.notes) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Check if we have coordinates
    if (!coordinates) {
      setError('Unable to determine location coordinates. Please check city and state.');
      setLoading(false);
      return;
    }

    const { lat, lng } = coordinates;

    // Prepare the data
    const insertData = {
      sighting_date: formData.sighting_date,
      latitude: Number(lat),
      longitude: Number(lng),
      city: formData.city.trim(),
      state: formData.state,
      notes: formData.notes.trim(),
      time_of_day: formData.time_of_day,
      apparition_tag: formData.apparition_tag,
      image_url: formData.image_url?.trim() || null
    };

    console.log('Submitting data to Supabase:', insertData);

    try {
      const { data, error: insertError } = await supabase
        .from('ghost_sightings')
        .insert([insertData])
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log('✅ Sighting reported successfully:', data);
      
      // Redirect to success page
      router.push('/report/success');
    } catch (err: any) {
      console.error('Error submitting sighting:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      // Better error message
      let errorMessage = 'Failed to submit sighting. Please try again.';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error_description) {
        errorMessage = err.error_description;
      } else if (err.hint) {
        errorMessage = `Database error: ${err.hint}`;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Report a Sighting
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us document paranormal activity by sharing your ghost sighting experience.
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Date of Sighting */}
            <div>
              <label htmlFor="sighting_date" className="block text-sm font-medium text-gray-300 mb-2">
                Date of Sighting <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="sighting_date"
                name="sighting_date"
                value={formData.sighting_date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Time of Day */}
            <div>
              <label htmlFor="time_of_day" className="block text-sm font-medium text-gray-300 mb-2">
                Time of Day <span className="text-red-400">*</span>
              </label>
              <select
                id="time_of_day"
                name="time_of_day"
                value={formData.time_of_day}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                {timesOfDay.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Apparition Type */}
            <div>
              <label htmlFor="apparition_tag" className="block text-sm font-medium text-gray-300 mb-2">
                Apparition Type <span className="text-red-400">*</span>
              </label>
              <select
                id="apparition_tag"
                name="apparition_tag"
                value={formData.apparition_tag}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                {apparitionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Location Section */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Location <span className="text-red-400">*</span>
              </label>
              
              {/* Get Location Button */}
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
              >
                {gettingLocation ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    <span>Getting your location...</span>
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              {/* Location Status Display */}
              {locationDetected && coordinates && (
                <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-300 text-sm">
                    <span>✓</span>
                    <span>Location detected: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
                  </div>
                </div>
              )}

              {/* Manual Entry Option */}
              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-3 text-center">OR enter manually:</p>
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., New York"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                State <span className="text-red-400">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                <option value="">Select a state</option>
                {usStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Notes/Description */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describe what you experienced in detail..."
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400 resize-none"
              />
              <p className="text-gray-500 text-xs mt-1">
                Please provide as much detail as possible about your experience.
              </p>
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              />
              <p className="text-gray-500 text-xs mt-1">
                If you have photographic evidence, provide a direct link to the image.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-black font-medium px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Sighting'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">📋 Guidelines for Reporting</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Be as detailed and accurate as possible in your description</li>
            <li>• Enter the city and state - coordinates will be determined automatically</li>
            <li>• Include the date and time of your sighting</li>
            <li>• Only submit genuine paranormal experiences</li>
            <li>• All submissions are reviewed before being added to the database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
