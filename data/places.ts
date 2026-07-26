// data/places.ts
import type { Place } from "@/types";

export const places: Place[] = [
  {
    id: "kigali-marriott",
    name: "Kigali Marriott Hotel",
    location: "Kigali, Rwanda",
    coordinates: {
      lat: -1.9536,
      lng: 30.0606,
    },
    coverVideo: "/videos/hotel-room.mp4",
    description:
      "A luxury Kigali destination combining rooms, dining, wellness and entertainment.",
    organizationId: "org-kigali-marriott",
    category: "Luxury Hotel",
    rating: 4.8,
    amenities: [
      "Luxury Rooms",
      "Restaurant",
      "Spa",
      "Swimming Pool",
      "WiFi"
    ],
    experiences: [
      {
        id: "hotel-room",
        placeId: "kigali-marriott",
        title: "Luxury Room Experience",
        description:
          "Premium rooms with modern design and city views.",
        category: "Stay",
        date: "2026-07-23",
        price: {
          amount: 250,
          currency: "USD",
          period: "night",
          displayText: "From $250/night",
          isStartingFrom: true,
        },
        media: [
          {
            id: "hotel-room-video",
            type: "video",
            url: "/videos/hotel-room.mp4",
          }
        ],
        actions: {
          booking: true,
          contact: true,
        },
      }
    ]
  },
  {
    id: "lake-kivu-resort",
    name: "Lake Kivu Resort",
    location: "Rubavu, Rwanda",
    coordinates: {
      lat: -1.6985,
      lng: 29.2569,
    },
    coverVideo: "/videos/lake-view.mp4",
    description:
      "A peaceful lakeside escape with beautiful views, nature and unforgettable experiences.",
    organizationId: "org-lake-kivu-resort",
    category: "Luxury Resort",
    rating: 4.7,
    amenities: [
      "Lake View",
      "Boat Tours",
      "Restaurant",
      "Nature Walks",
      "WiFi"
    ],
    experiences: [
      {
        id: "lake-view",
        placeId: "lake-kivu-resort",
        title: "Lake Kivu Sunset Experience",
        description:
          "Relax beside one of Africa's most beautiful lakes.",
        category: "Stay",
        date: "2026-07-23",
        price: {
          amount: 180,
          currency: "USD",
          period: "night",
          displayText: "From $180/night",
          isStartingFrom: true,
        },
        media: [
          {
            id: "lake-view-video",
            type: "video",
            url: "/videos/lake-view.mp4",
          }
        ],
        actions: {
          booking: true,
          contact: true,
        },
      }
    ]
  },
  {
    id: "heaven-restaurant",
    name: "Heaven Restaurant",
    location: "Kigali, Rwanda",
    coordinates: {
      lat: -1.9441,
      lng: 30.0619,
    },
    coverVideo: "/videos/rooftop-dining.mp4",
    description:
      "A beautiful restaurant in the heart of Kigali offering a blend of international and local cuisines.",
    organizationId: "org-heaven-restaurant",
    category: "Restaurant",
    rating: 4.6,
    amenities: [
      "Fine Dining",
      "Garden Setting",
      "Local Cuisine",
      "International Menu",
      "Cocktails"
    ],
    experiences: [
      {
        id: "rooftop-dining",
        placeId: "heaven-restaurant",
        title: "Rooftop Dining Experience",
        description:
          "Enjoy exquisite cuisine with panoramic views of Kigali.",
        category: "Food",
        date: "2026-07-23",
        price: {
          amount: 50,
          currency: "USD",
          period: "person",
          displayText: "$50/person",
          isStartingFrom: false,
        },
        media: [
          {
            id: "rooftop-dining-video",
            type: "video",
            url: "/videos/rooftop-dining.mp4",
          }
        ],
        actions: {
          booking: true,
          contact: true,
        },
      }
    ]
  },
  {
    id: "nyungwe-lodge",
    name: "Nyungwe Forest Lodge",
    location: "Nyungwe, Rwanda",
    coordinates: {
      lat: -2.4844,
      lng: 29.1086,
    },
    coverVideo: "/videos/nature.mp4",
    description:
      "Nestled in the heart of Nyungwe Forest, this lodge offers an immersive rainforest experience.",
    organizationId: "org-nyungwe-lodge",
    category: "Lodge",
    rating: 4.9,
    amenities: [
      "Rainforest Views",
      "Chimpanzee Trekking",
      "Canopy Walk",
      "Birds Watching",
      "Spa"
    ],
    experiences: [
      {
        id: "canopy-walk",
        placeId: "nyungwe-lodge",
        title: "Canopy Walk Adventure",
        description:
          "Walk among the treetops in one of Africa's oldest rainforests.",
        category: "Adventure",
        date: "2026-07-23",
        price: {
          amount: 80,
          currency: "USD",
          period: "person",
          displayText: "$80/person",
          isStartingFrom: false,
        },
        media: [
          {
            id: "canopy-walk-video",
            type: "video",
            url: "/videos/nature.mp4",
          }
        ],
        actions: {
          booking: true,
          contact: true,
        },
      },
      {
        id: "nyungwe-lodge-stay",
        placeId: "nyungwe-lodge",
        title: "Rainforest Lodge Stay",
        description:
          "Immerse yourself in the heart of the rainforest with luxury accommodations.",
        category: "Stay",
        date: "2026-07-23",
        price: {
          amount: 350,
          currency: "USD",
          period: "night",
          displayText: "From $350/night",
          isStartingFrom: true,
        },
        media: [
          {
            id: "nyungwe-lodge-video",
            type: "video",
            url: "/videos/nature.mp4",
          }
        ],
        actions: {
          booking: true,
          contact: true,
        },
      }
    ]
  },
  {
    id: "inema-arts-center",
    name: "Inema Arts Center",
    location: "Kigali, Rwanda",
    coordinates: {
      lat: -1.9467,
      lng: 30.0641,
    },
    coverVideo: "/videos/culture.mp4",
    description:
      "A vibrant art center showcasing contemporary Rwandan art and cultural performances.",
    organizationId: "org-inema-arts",
    category: "Art & Culture",
    rating: 4.5,
    amenities: [
      "Art Gallery",
      "Live Performances",
      "Art Workshops",
      "Cafe",
      "Gift Shop"
    ],
    experiences: [
      {
        id: "art-tour",
        placeId: "inema-arts-center",
        title: "Art & Culture Experience",
        description:
          "Immerse yourself in Rwandan art and culture at Inema Arts Center.",
        category: "Culture",
        date: "2026-07-23",
        price: {
          amount: 30,
          currency: "USD",
          period: "person",
          displayText: "$30/person",
          isStartingFrom: false,
        },
        media: [
          {
            id: "art-tour-video",
            type: "video",
            url: "/videos/culture.mp4",
          }
        ],
        actions: {
          booking: true,
          contact: true,
        },
      }
    ]
  }
];