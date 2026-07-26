// components/feed/UpNextFeed.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSaved } from '@/hooks/useSaved';
import { organizations } from '@/data/organizations';
import type { Experience, Place, SimplePlace } from '@/types';

export interface FeedExperience extends Experience {
  place: Place | SimplePlace;
  placeId: string;
  video: string;
  date?: string;
  time?: string;
  venue?: string;
  status?: 'upcoming' | 'live' | 'past';
}

type Props = {
  experiences: FeedExperience[];
};

export default function UpNextFeed({ experiences }: Props) {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { isSaved, toggleSave } = useSaved();

  // Check if place is full Place or SimplePlace
  const isFullPlace = (place: Place | SimplePlace): place is Place => {
    return 'description' in place && 'coverVideo' in place;
  };

  const getOrganization = (place: Place | SimplePlace) => {
    if (isFullPlace(place)) {
      return organizations.find(org => org.id === place.organizationId);
    }
    return null;
  };

  const handleShare = async (experience: FeedExperience, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: experience.title,
      text: `Check out ${experience.title} at ${experience.place.name}!`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/place/${experience.place.id}` : ''
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

  const handleToggleSave = (experienceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(experienceId);
  };

  // Format price display
  const formatPrice = (experience: FeedExperience) => {
    // Check for free entry
    if (experience.price?.type === 'free') {
      return {
        display: 'Free Entry',
        icon: '🟢',
        className: 'text-emerald-400'
      };
    }

    // Check for multi-tier pricing
    if (experience.prices && experience.prices.length > 0) {
      const sorted = [...experience.prices].sort((a, b) => a.amount - b.amount);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const symbol = min.currency === 'USD' ? '$' : 'Frw';
      return {
        display: `${symbol}${min.amount} - ${symbol}${max.amount}`,
        icon: '💰',
        className: 'text-gold',
        tiers: experience.prices
      };
    }

    // Check for range pricing
    if (experience.price?.type === 'range') {
      const symbol = experience.price.currency === 'USD' ? '$' : 'Frw';
      return {
        display: `${symbol}${experience.price.min} - ${symbol}${experience.price.max}`,
        icon: '💰',
        className: 'text-gold'
      };
    }

    // Single price (default)
    if (experience.price?.amount) {
      const symbol = experience.price.currency === 'USD' ? '$' : 'Frw';
      return {
        display: experience.price.displayText || `${symbol}${experience.price.amount}`,
        icon: '💰',
        className: 'text-gold'
      };
    }

    return null;
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

    const slides = document.querySelectorAll('.upnext-slide');
    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [experiences]);

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

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {experiences.map((experience, index) => {
        const video = experience.video || experience.media?.[0]?.url || '';
        const org = getOrganization(experience.place);
        const phone = org?.phone ?? '';
        const whatsapp = org?.whatsapp ?? '';
        const coords = isFullPlace(experience.place) ? experience.place.coordinates : undefined;
        const mapsUrl = coords
          ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
          : '#';
        const saved = isSaved(experience.id);
        const isLive = experience.status === 'live';
        const isUpcoming = experience.status === 'upcoming';
        const priceInfo = formatPrice(experience);

        const getPlaceName = () => {
          if (experience.venue) return experience.venue;
          return experience.place.name;
        };

        return (
          <section
            key={experience.id}
            data-index={index}
            className="upnext-slide h-screen w-full snap-start relative"
          >
            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={video}
              muted
              loop
              playsInline
              preload={index === 0 ? 'auto' : 'metadata'}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-6 left-6 z-20">
              {isLive && (
                <span className="px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm border border-red-400/30 animate-pulse">
                  <span className="text-white text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    LIVE NOW
                  </span>
                </span>
              )}
              {isUpcoming && (
                <span className="px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/30">
                  <span className="text-white text-xs font-bold">UPCOMING</span>
                </span>
              )}
            </div>

            {/* Content - Bottom Left */}
            <div className="absolute bottom-28 left-6 right-20 z-20">
              <p className="text-gold font-bold">{experience.category}</p>
              
              {/* Title with Save Button inline */}
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-4xl font-black">{experience.title}</h1>
                <button
                  onClick={(e) => handleToggleSave(experience.id, e)}
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
              
              {/* Price Display */}
              {priceInfo && (
                <div className={`flex items-center gap-1 mt-1 ${priceInfo.className}`}>
                  <span>{priceInfo.icon}</span>
                  <span className="font-semibold text-sm">{priceInfo.display}</span>
                </div>
              )}
              
              {/* Venue with Map Button inline */}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white/70 text-sm">📍 {getPlaceName()}</p>
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
              
              {/* Date & Time */}
              {experience.date && (
                <p className="text-white/40 text-xs mt-1">
                  {new Date(experience.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  {experience.time && ` at ${experience.time}`}
                </p>
              )}
              
              <p className="text-white/40 text-xs mt-1 max-w-md line-clamp-2">{experience.description}</p>
            </div>

            {/* Action Buttons - Right side (Phone, WhatsApp, Share) - NOW INCLUDED */}
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
                onClick={(e) => handleShare(experience, e)}
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