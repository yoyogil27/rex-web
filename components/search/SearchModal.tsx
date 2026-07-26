// components/search/SearchModal.tsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { useSearch } from '@/hooks/useSearch';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: Props) {
  const { clearSearch } = useSearch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      clearSearch();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, clearSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <SearchBar onClose={onClose} />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto p-4 pb-20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        <SearchResults onResultClick={onClose} />
      </div>
    </div>
  );
}