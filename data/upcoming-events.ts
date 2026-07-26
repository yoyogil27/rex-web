// data/upcoming-events.ts
import type { UpcomingEventExperience } from "@/types/experience";

export const upcomingEventsData: UpcomingEventExperience[] = [
  {
    id: "kigali-jazz-festival-2026",
    title: "Kigali Jazz Festival 2026",
    description: "The premier jazz festival in East Africa returns with an incredible lineup of international and local jazz artists.",
    category: "Event",
    placeId: "kigali-convention-center",
    status: "upcoming",
    date: "2026-08-15",
    venue: "Kigali Convention Center",
    price: {
      type: "single",
      amount: 75,
      currency: "USD",
      displayText: "$75/ticket",
      isStartingFrom: false,
    },
    media: [
      {
        id: "jazz-festival-2026-video",
        type: "video",
        url: "/videos/jazz-night.mp4",
      }
    ],
    actions: {
      booking: true,
      contact: true,
    },
  },
  {
    id: "kigali-food-market-2026",
    title: "Kigali Food Market 2026",
    description: "A celebration of Rwandan and international cuisine. Taste dishes from top chefs, discover local produce, and enjoy live cooking demonstrations.",
    category: "Event",
    placeId: "kigali-heights",
    status: "upcoming",
    date: "2026-09-20",
    venue: "Kigali Heights",
    price: {
      type: "range",
      min: 20,
      max: 60,
      currency: "USD",
      displayText: "$20 - $60",
    },
    media: [
      {
        id: "food-market-2026-video",
        type: "video",
        url: "/videos/rooftop-dining.mp4",
      }
    ],
    actions: {
      booking: true,
      contact: true,
    },
  },
  {
    id: "gorilla-trekking-forum-2026",
    title: "Gorilla Trekking Forum 2026",
    description: "Join conservation experts, tour operators, and adventure enthusiasts at the annual gorilla trekking forum.",
    category: "Event",
    placeId: "virunga-lodge",
    status: "upcoming",
    date: "2026-07-10",
    venue: "Virunga Lodge",
    prices: [
      {
        id: "early-bird",
        label: "Early Bird",
        amount: 150,
        currency: "USD",
        description: "Limited availability",
        available: 50
      },
      {
        id: "standard",
        label: "Standard",
        amount: 200,
        currency: "USD",
        description: "Regular admission",
        available: 100
      },
      {
        id: "vip",
        label: "VIP Experience",
        amount: 350,
        currency: "USD",
        description: "Includes exclusive access and dinner",
        available: 25
      }
    ],
    price: {
      type: "tiered",
      displayText: "$150 - $350"
    },
    media: [
      {
        id: "gorilla-forum-2026-video",
        type: "video",
        url: "/videos/nature.mp4",
      }
    ],
    actions: {
      booking: true,
      contact: true,
    },
  }
];

// Helper function to get only upcoming events (date not passed)
export function getUpcomingEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return upcomingEventsData.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
}

// Helper function to check if an event has passed
export function isEventPast(event: UpcomingEventExperience) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate < today;
}