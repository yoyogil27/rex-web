// components/feed/StayFeed.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/types';
import { organizations } from '@/data/organizations';
import { useSaved } from '@/hooks/useSaved';

type Props = {
  places: Place[];
};

export default function StayFeed({ places }: Props) {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { isSaved, toggleSave } = useSaved();

  function getOrganization(place: Place) {
    return organizations.find(org => org.id === place.organizationId);
  }

  const handleShare = async (place: Place, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: place.name,
      text: `Check out ${place.name} in ${place.location}!`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/place/${place.id}` : ''
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Copy error:', err);
        prompt('Copy this link:', shareData.url);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveVideo(index);
          }
        });
      },
      { threshold: 0.75 }
    );

    const slides = document.querySelectorAll('.stay-slide');
    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [places]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeVideo) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeVideo]);

  const handleToggleSave = (placeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(placeId);
  };

  // Get price from the first experience of this place
  const getPlacePrice = (place: Place) => {
    if (place.experiences && place.experiences.length > 0) {
      const exp = place.experiences[0];
      if (exp.price) {
        if (exp.price.displayText) return exp.price.displayText;
        const symbol = exp.price.currency === 'USD' ? '$' : 'Frw';
        const prefix = exp.price.isStartingFrom ? 'From ' : '';
        return `${prefix}${symbol}${exp.price.amount}/${exp.price.period || 'night'}`;
      }
    }
    return null;
  };

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {places.map((place, index) => {
        const org = getOrganization(place);
        const phone = org?.phone ?? '';
        const whatsapp = org?.whatsapp ?? '';
        const coords = org?.coordinates;
        const mapsUrl = coords
          ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
          : '#';
        const saved = isSaved(place.id);
        const priceDisplay = getPlacePrice(place);

        return (
          <section
            key={place.id}
            data-index={index}
            className="stay-slide h-screen w-full snap-start relative"
          >
            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={place.coverVideo}
              muted
              loop
              playsInline
              preload={index === 0 ? 'auto' : 'metadata'}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Content - Bottom Left */}
            <div className="absolute bottom-28 left-6 right-20 z-20">
              <p className="text-gold font-bold">Stay</p>
              
              {/* Place Name with Save Button inline */}
              <div className="flex items-center gap-3 mt-2">
                <h1 className="text-4xl font-black">{place.name}</h1>
                {/* Save Button - Next to place name */}
                <button
                  onClick={(e) => handleToggleSave(place.id, e)}
                  className={`
                    w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110 shrink-0
                    ${saved 
                      ? 'bg-gold/20 border-gold/30 text-gold' 
                      : 'bg-black/40 border-white/20 text-white hover:bg-white/20'
                    }
                  `}
                  aria-label={saved ? 'Unsave' : 'Save'}
                >
                  <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
              
              {/* Price Display - Prominent for stays */}
              {priceDisplay && (
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gold font-semibold text-sm">{priceDisplay}</span>
                </div>
              )}
              
              {/* Location with Map Button inline */}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white/70 text-sm">{place.location}</p>
                {coords && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/30 transition hover:scale-110 shrink-0"
                    aria-label="Open in maps"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </a>
                )}
              </div>
              
              {place.rating && (
                <p className="text-gold text-xs mt-1">★ {place.rating}</p>
              )}
            </div>

            {/* Action Buttons - Right side (Phone, WhatsApp, Share) */}
            <div className="fixed right-5 bottom-32 z-40 flex flex-col gap-4">
              {/* Phone Button - Most urgent */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-black shadow-xl hover:bg-gold/80 transition hover:scale-105"
                  aria-label="Call"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              )}

              {/* WhatsApp Button - Second most urgent */}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl hover:opacity-80 transition hover:scale-105"
                  aria-label="WhatsApp"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}

              {/* Share Button - Bottom of action buttons */}
              <button
                onClick={(e) => handleShare(place, e)}
                className="h-12 w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl hover:bg-white/20 transition hover:scale-105"
                aria-label="Share"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}