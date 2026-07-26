// components/feed/NearMeFeed.tsx
'use client';

import { useState, useEffect } from 'react';
import { getNearbyExperiences } from '@/lib/supabase/data';
import ExperienceCard from '@/components/experience/ExperienceCard';
import { MapPin, Navigation, RotateCcw, X } from 'lucide-react';

type Props = {
  onClose: () => void;
};

export default function NearMeFeed({ onClose }: Props) {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = async () => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        await fetchNearby(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.error('Location error:', err);
        setError('Unable to detect your location. Please enable location services.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchNearby = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const data = await getNearbyExperiences(lat, lng, radius);
      setExperiences(data);
    } catch (err) {
      console.error('Error fetching nearby:', err);
      setError('Failed to load nearby experiences.');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (location) {
      setIsLoading(true);
      await fetchNearby(location.lat, location.lng);
    } else {
      detectLocation();
    }
  };

  const changeRadius = () => {
    const nextRadius = radius === 5 ? 10 : radius === 10 ? 20 : radius === 20 ? 50 : 5;
    setRadius(nextRadius);
    if (location) {
      fetchNearby(location.lat, location.lng);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  if (isLocating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
        <p className="text-gray-400 mt-4">Detecting your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black p-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <MapPin size={32} className="text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Location Access Required</h3>
        <p className="text-gray-400 text-center max-w-sm mb-6">{error}</p>
        <button
          onClick={detectLocation}
          className="px-6 py-3 bg-gold text-black font-medium rounded-full hover:bg-gold/80 transition"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-white transition text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gold border-t-transparent" />
        <span className="text-gray-400 ml-3">Loading nearby...</span>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black p-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Navigation size={32} className="text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Experiences Nearby</h3>
        <p className="text-gray-400 text-center max-w-sm">
          Try increasing your search radius or move to a different area.
        </p>
        <button
          onClick={refresh}
          className="mt-6 px-6 py-3 bg-gold text-black font-medium rounded-full hover:bg-gold/80 transition"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin size={18} className="text-gold" />
                Near Me
              </h2>
              <p className="text-xs text-gray-400">
                {experiences.length} experiences within {radius}km
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <RotateCcw size={18} className="text-gray-400" />
            </button>
            <button
              onClick={changeRadius}
              className="px-3 py-1.5 rounded-full bg-white/10 text-sm text-white hover:bg-white/20 transition"
            >
              {radius}km
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="pt-20 pb-20">
        <div className="relative h-screen w-full overflow-hidden">
          <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
            {experiences.map((experience, index) => (
              <section
                key={experience.id}
                className="h-screen w-full snap-start relative"
              >
                <ExperienceCard experience={experience} />
                
                {/* Distance Badge */}
                <div className="absolute top-24 right-6 z-30 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  <span className="text-xs text-white flex items-center gap-1">
                    <MapPin size={12} className="text-gold" />
                    {experience.distance < 1 ? '<1km' : `${Math.round(experience.distance)}km`}
                  </span>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}