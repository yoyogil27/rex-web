// app/saved/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSaved } from '@/hooks/useSaved';
import { getAllExperiences } from '@/data';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ExperienceCard from '@/components/experience/ExperienceCard';

export default function SavedPage() {
  const { savedIds, count } = useSaved();
  const [savedExperiences, setSavedExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedExperiences = async () => {
      try {
        const allExperiences = await getAllExperiences();
        const filtered = allExperiences.filter(
          (exp: any) => savedIds.includes(exp.id)
        );
        setSavedExperiences(filtered);
      } catch (error) {
        console.error('Error loading saved experiences:', error);
        setSavedExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (savedIds.length > 0) {
      loadSavedExperiences();
    } else {
      setSavedExperiences([]);
      setIsLoading(false);
    }
  }, [savedIds]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Header />
        <div className="pt-24 pb-32 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Loading your saved experiences...</p>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-24 pb-32 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            My REX
          </h1>
          <p className="text-gray-400 mt-1">
            {count > 0 ? `${count} saved experience${count > 1 ? 's' : ''}` : 'No saved experiences yet'}
          </p>
        </div>

        {/* Saved content */}
        {savedExperiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No saved experiences yet</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Discover amazing experiences in Rwanda and save them here to plan your journey.
            </p>
            <Link
              href="/explore"
              className="px-6 py-3 bg-gold text-black font-medium rounded-full hover:bg-gold/80 transition-all duration-300 hover:scale-105"
            >
              Explore Experiences
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {savedExperiences.map((experience) => {
              // Get the place name from various possible sources
              const placeName = 
                experience.place?.name || 
                experience.venue || 
                experience.location || 
                'Unknown Location';
              
              // Get the place ID
              const placeId = experience.place?.id || experience.placeId || '';
              
              // Get the video URL
              const videoUrl = experience.video || experience.media?.[0]?.url || '';
              
              // Ensure the experience has all required fields for ExperienceCard
              const expWithPlace = {
                ...experience,
                place: experience.place || { 
                  id: placeId, 
                  name: placeName,
                  location: placeName
                },
                placeId: placeId,
                video: videoUrl,
              };
              
              return (
                <ExperienceCard 
                  key={experience.id} 
                  experience={expWithPlace} 
                />
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}