// components/search/SearchBar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

type Props = {
  onClose?: () => void;
};

export default function SearchBar({ onClose }: Props) {
  const { query, search, clearSearch, isLoading } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (value: string) => {
    setInputValue(value);
    search(value);
  };

  const handleClear = () => {
    setInputValue('');
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-gold transition">
        <Search size={20} className="text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search experiences, places, businesses..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            <X size={18} className="text-gray-400" />
          </button>
        )}
        {isLoading && (
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}