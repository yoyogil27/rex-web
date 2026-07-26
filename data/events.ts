// data/events.ts
import type { Event } from "@/types";

export const events: Event[] = [
  {
    id: "event-kigali-jazz",
    title: "Kigali Jazz Night",
    description:
      "A live music evening featuring local artists and a vibrant atmosphere.",
    startDate: "2026-07-18",
    endDate: "2026-07-18",
    location: "Kigali, Rwanda",
    experiences: [],
  },
];

// Past Events (Video Memories)
export const pastEvents = [
  {
    id: "past-jazz-festival-2025",
    title: "Kigali Jazz Festival 2025",
    description: "Relive the magic of the 2025 Kigali Jazz Festival. An unforgettable weekend of music, culture, and celebration.",
    category: "Event" as const,
    location: "Kigali Convention Center",
    image: "/images/jazz-2025.jpg",
    mediaType: "video" as const,
    status: "past" as const,
    video: "/videos/jazz-night.mp4",
    date: "2025-08-15",
    venue: "Kigali Convention Center",
    price: {
      amount: 60,
      currency: "USD",
      period: "session",
      displayText: "$60/ticket",
      isStartingFrom: false,
    },
    place: {
      id: "kigali-convention-center",
      name: "Kigali Convention Center",
      location: "Kigali, Rwanda",
      coordinates: {
        lat: -1.9403,
        lng: 30.0619,
      }
    }
  },
  {
    id: "past-umuco-festival-2025",
    title: "Umuco Festival 2025 Memories",
    description: "Experience the vibrant celebration of Rwandan culture at Umuco Festival 2025. Traditional dance, music, art, and storytelling.",
    category: "Event" as const,
    location: "Inema Arts Center",
    image: "/images/umuco-2025.jpg",
    mediaType: "video" as const,
    status: "past" as const,
    video: "/videos/culture.mp4",
    date: "2025-09-20",
    venue: "Inema Arts Center",
    price: {
      amount: 25,
      currency: "USD",
      period: "session",
      displayText: "$25/ticket",
      isStartingFrom: false,
    },
    place: {
      id: "inema-arts-center",
      name: "Inema Arts Center",
      location: "Kigali, Rwanda",
      coordinates: {
        lat: -1.9467,
        lng: 30.0641,
      }
    }
  },
  {
    id: "past-gorilla-summit-2025",
    title: "Gorilla Trekking Summit 2025",
    description: "Highlights from the 2025 Gorilla Trekking Summit - three days of conservation dialogue, adventure stories, and community building.",
    category: "Event" as const,
    location: "Musanze, Northern Province",
    image: "/images/gorilla-summit-2025.jpg",
    mediaType: "video" as const,
    status: "past" as const,
    video: "/videos/nature.mp4",
    date: "2025-10-10",
    venue: "Virunga Lodge",
    price: {
      amount: 150,
      currency: "USD",
      period: "session",
      displayText: "$150/ticket",
      isStartingFrom: false,
    },
    place: {
      id: "virunga-lodge",
      name: "Virunga Lodge",
      location: "Musanze, Rwanda",
      coordinates: {
        lat: -1.5386,
        lng: 29.6104,
      }
    }
  }
];