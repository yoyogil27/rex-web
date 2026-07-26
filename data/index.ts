// data/index.ts
import { 
  getExperiences, 
  getPlaces, 
  getPlaceById,
  getUpcomingEvents,
  getPastEvents,
  getOrganizations,
  search
} from '@/lib/supabase/data';

// Export all functions
export {
  getExperiences,
  getPlaces,
  getPlaceById,
  getUpcomingEvents,
  getPastEvents,
  getOrganizations,
  search
};

// For backward compatibility
export async function getAllExperiences() {
  return getExperiences();
}

export async function getAllPlaces() {
  return getPlaces();
}

export async function getAllOrganizations() {
  return getOrganizations();
}

// Get explore experiences (places + past events)
export async function getExploreExperiences() {
  const [places, pastEvents] = await Promise.all([
    getPlaces(),
    getPastEvents()
  ]);

  console.log('Places received:', places?.length || 0);
  console.log('Past events received:', pastEvents?.length || 0);

  // Format places as experiences - check if places is an array
  const placeExperiences = [];
  if (places && Array.isArray(places)) {
    for (const place of places) {
      // Format the place as an experience
      placeExperiences.push({
        id: place.id,
        title: place.name,
        description: place.description || 'Discover this amazing place in Rwanda.',
        category: place.category || 'Experience',
        placeId: place.id,
        place: place,
        video: place.cover_video_url || '',
        media: place.cover_video_url ? [{ url: place.cover_video_url, type: 'video' }] : [],
        rating: place.rating,
        price: place.price_amount ? {
          amount: place.price_amount,
          currency: place.price_currency || 'USD',
          displayText: place.price_display_text,
        } : undefined,
      });
    }
  }

  // Format past events
  const pastEventExperiences = [];
  if (pastEvents && Array.isArray(pastEvents)) {
    for (const event of pastEvents) {
      pastEventExperiences.push({
        ...event,
        id: event.id,
        title: event.title,
        description: event.description || 'A past event to remember.',
        category: event.category || 'Event',
        mediaType: 'video',
        status: 'past',
        video: event.video_url || '',
        place: event.place || { id: event.place_id, name: event.venue || 'Venue' },
        actions: undefined,
      });
    }
  }

  const allExperiences = [...placeExperiences, ...pastEventExperiences];
  console.log('Total explore experiences:', allExperiences.length);
  
  return allExperiences;
}

// Get UpNext experiences (upcoming events only)
export async function getUpNextExperiences() {
  const events = await getUpcomingEvents();
  
  console.log('Upcoming events received:', events?.length || 0);
  
  if (!events || !Array.isArray(events)) {
    return [];
  }
  
  return events.map((event: any) => ({
    ...event,
    id: event.id,
    title: event.title,
    description: event.description || 'An upcoming event in Rwanda.',
    category: event.category || 'Event',
    status: event.status || 'upcoming',
    date: event.date,
    venue: event.venue || 'Venue',
    place: {
      id: event.place_id,
      name: event.venue || 'Venue',
      location: event.venue || 'Location',
    },
    video: event.video_url || '',
    price: event.price_amount ? {
      amount: event.price_amount,
      currency: event.price_currency || 'USD',
      displayText: event.price_display_text,
      type: event.price_type,
    } : undefined,
  }));
}

// Get place by ID with details
export async function getPlaceByIdWithDetails(id: string) {
  return getPlaceById(id);
}