// hooks/useSearch.ts
'use client';

import { useState, useCallback } from 'react';
import { search as searchData } from '@/lib/supabase/data';
import type { SearchResult, SearchFilters } from '@/types/search';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
  });

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setQuery('');
      return;
    }

    setIsLoading(true);
    setQuery(searchQuery);

    try {
      const data = await searchData(searchQuery);
      
      // Transform data to SearchResult format
      const searchResults = data.map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        description: item.description || '',
        type: item.type || 'experience',
        category: item.category || item.type || '',
        location: item.location || item.venue || '',
        image: item.video_url || item.cover_video_url || '',
        video: item.video_url || item.cover_video_url || '',
        rating: item.rating || 0,
        price: item.price_amount ? {
          amount: item.price_amount,
          currency: item.price_currency || 'USD',
          displayText: item.price_display_text,
        } : undefined,
        relevance: 1,
      }));

      // Apply filters
      let filteredResults = searchResults;
      
      if (filters.type && filters.type !== 'all') {
        filteredResults = filteredResults.filter(r => r.type === filters.type);
      }

      if (filters.category) {
        filteredResults = filteredResults.filter(r => 
          r.category?.toLowerCase() === filters.category?.toLowerCase()
        );
      }

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setFilters({ type: 'all' });
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const hasResults = results.length > 0;

  return {
    query,
    results,
    isLoading,
    hasResults,
    filters,
    search,
    clearSearch,
    updateFilters,
  };
}