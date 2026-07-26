// hooks/useSaved.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export function useSaved() {
  const { user, isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved IDs from Supabase
  useEffect(() => {
    const loadSaved = async () => {
      if (!isAuthenticated || !user) {
        setSavedIds([]);
        setIsLoaded(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('saved_experiences')
          .select('experience_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const ids = data.map((item: any) => item.experience_id);
        setSavedIds(ids);
      } catch (error) {
        console.error('Error loading saved experiences:', error);
        setSavedIds([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSaved();
  }, [user, isAuthenticated]);

  const toggleSave = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      // Show sign in modal - handled in component
      return;
    }

    const isCurrentlySaved = savedIds.includes(id);

    try {
      if (isCurrentlySaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_experiences')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', id);

        if (error) throw error;

        setSavedIds(prev => prev.filter(savedId => savedId !== id));
      } else {
        // Save
        const { error } = await supabase
          .from('saved_experiences')
          .insert({
            user_id: user.id,
            experience_id: id,
          });

        if (error) throw error;

        setSavedIds(prev => [...prev, id]);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }, [user, isAuthenticated, savedIds]);

  const isSaved = useCallback((id: string) => {
    return savedIds.includes(id);
  }, [savedIds]);

  const clearSaved = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('saved_experiences')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedIds([]);
    } catch (error) {
      console.error('Error clearing saved:', error);
    }
  }, [user, isAuthenticated]);

  return {
    savedIds,
    toggleSave,
    isSaved,
    clearSaved,
    isLoaded,
    count: savedIds.length,
  };
}