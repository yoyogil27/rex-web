// lib/supabase/data.ts
import { supabase } from './client';

// Get all places
export async function getPlaces() {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching places:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching places:', error);
    return [];
  }
}

// Get all experiences
export async function getExperiences() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experiences:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching experiences:', error);
    return [];
  }
}

// Get place by ID
export async function getPlaceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching place:', error.message);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Unexpected error fetching place:', error);
    return null;
  }
}

// Get upcoming events
export async function getUpcomingEvents() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('status', 'upcoming')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming events:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching upcoming events:', error);
    return [];
  }
}

// Get past events
export async function getPastEvents() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('status', 'past')
      .eq('media_type', 'video')
      .lt('date', today)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching past events:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching past events:', error);
    return [];
  }
}

// Get organizations
export async function getOrganizations() {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching organizations:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching organizations:', error);
    return [];
  }
}

// Search
export async function search(query: string) {
  try {
    const results = [];

    // Search experiences
    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(10);

    if (experiences && experiences.length > 0) {
      results.push(...experiences.map((e: any) => ({ ...e, type: 'experience' })));
    }

    // Search places
    const { data: places } = await supabase
      .from('places')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .limit(10);

    if (places && places.length > 0) {
      results.push(...places.map((p: any) => ({ ...p, type: 'place' })));
    }

    // Search organizations
    const { data: organizations } = await supabase
      .from('organizations')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
      .eq('status', 'approved')
      .limit(10);

    if (organizations && organizations.length > 0) {
      results.push(...organizations.map((o: any) => ({ ...o, type: 'organization' })));
    }

    return results.sort((a, b) => {
      const aScore = (a.title?.toLowerCase().includes(query.toLowerCase()) ? 3 : 0) +
                     (a.name?.toLowerCase().includes(query.toLowerCase()) ? 3 : 0);
      const bScore = (b.title?.toLowerCase().includes(query.toLowerCase()) ? 3 : 0) +
                     (b.name?.toLowerCase().includes(query.toLowerCase()) ? 3 : 0);
      return bScore - aScore;
    });
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Get nearby experiences
export async function getNearbyExperiences(
  lat: number, 
  lng: number, 
  radiusKm: number = 10
) {
  try {
    const { data: places, error } = await supabase
      .from('places')
      .select('*, experiences(*)')
      .not('lat', 'is', null)
      .not('lng', 'is', null);

    if (error) {
      console.error('Error fetching places for nearby:', error);
      return [];
    }

    if (!places || places.length === 0) {
      return [];
    }

    const nearbyPlaces = places
      .map((place: any) => {
        const distance = calculateDistance(lat, lng, place.lat, place.lng);
        return { ...place, distance };
      })
      .filter((place: any) => place.distance <= radiusKm)
      .sort((a: any, b: any) => a.distance - b.distance);

    const nearbyExperiences = nearbyPlaces.flatMap((place: any) => {
      const experiences = place.experiences || [];
      return experiences.map((exp: any) => ({
        ...exp,
        place: place,
        distance: place.distance,
      }));
    });

    return nearbyExperiences;
  } catch (error) {
    console.error('Unexpected error fetching nearby experiences:', error);
    return [];
  }
}

// Helper: Calculate distance
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}