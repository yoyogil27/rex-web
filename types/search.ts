// types/search.ts
import type { Experience, Place, Organization } from './index';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'experience' | 'place' | 'organization';
  category?: string;
  location?: string;
  image?: string;
  video?: string;
  rating?: number;
  price?: {
    amount?: number;
    currency?: string;
    displayText?: string;
  };
  relevance: number;
}

export interface SearchFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: 'experience' | 'place' | 'organization' | 'all';
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  hasResults: boolean;
  filters: SearchFilters;
}