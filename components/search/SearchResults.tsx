// components/search/SearchResults.tsx
'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/types/search';

type Props = {
  onResultClick?: () => void;
};

export default function SearchResults({ onResultClick }: Props) {
  const { results, hasResults, isLoading, query } = useSearch();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return '🎯';
      case 'place':
        return '📍';
      case 'organization':
        return '🏢';
      default:
        return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'text-gold';
      case 'place':
        return 'text-blue-400';
      case 'organization':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'experience':
        return 'Experience';
      case 'place':
        return 'Place';
      case 'organization':
        return 'Business';
      default:
        return '';
    }
  };

  if (!query) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-gray-400">Search for experiences, places, or businesses in Rwanda</p>
        <p className="text-gray-600 text-sm mt-2">Try "Kigali", "Lake Kivu", "restaurant"</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 ml-3">Searching...</span>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          We couldn't find anything matching "{query}"
        </p>
        <p className="text-gray-600 text-sm mt-2">Try different keywords or check your spelling</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400 mb-4">
        Found {results.length} result{results.length > 1 ? 's' : ''} for "{query}"
      </p>
      
      {results.map((result) => (
        <Link
          key={`${result.type}-${result.id}`}
          href={result.type === 'experience' ? `/explore` : `/place/${result.id}`}
          onClick={onResultClick}
          className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/30 transition group"
        >
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/50 flex-shrink-0">
              {result.video || result.image ? (
                <video
                  src={result.video || result.image}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {getTypeIcon(result.type)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold ${getTypeColor(result.type)}`}>
                  {getTypeLabel(result.type)}
                </span>
                {result.rating && (
                  <span className="text-xs text-gold">★ {result.rating}</span>
                )}
                {result.price?.displayText && (
                  <span className="text-xs text-gold font-semibold">
                    {result.price.displayText}
                  </span>
                )}
              </div>
              <h4 className="text-white font-semibold group-hover:text-gold transition line-clamp-1">
                {result.title}
              </h4>
              <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                {result.description}
              </p>
              {result.location && (
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <span>📍</span> {result.location}
                </p>
              )}
            </div>

            {/* Arrow */}
            <div className="text-gray-500 group-hover:text-gold transition flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}