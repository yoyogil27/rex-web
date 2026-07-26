// types/experience.ts
import type { Media } from "./media";
import type { Place, SimplePlace } from "./place";

export type ExperienceCategory =
  | "Food"
  | "Adventure"
  | "Nature"
  | "Lifestyle"
  | "Culture"
  | "Stay"
  | "Event";

export type ExperienceStatus = "live" | "upcoming" | "past";

export interface Price {
  type?: "free" | "single" | "range" | "tiered"; // Made optional for backward compatibility
  amount?: number;
  min?: number;
  max?: number;
  currency?: string;
  period?: string;
  displayText?: string;
  isStartingFrom?: boolean;
}

export interface PriceTier {
  id: string;
  label: string;
  amount: number;
  currency: string;
  description?: string;
  available?: number;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  category: ExperienceCategory;
  placeId: string;
  place?: Place | SimplePlace;
  media: Media[];
  date?: string;
  mediaType?: "video" | "image";
  status?: ExperienceStatus;
  video?: string;
  price?: Price;
  prices?: PriceTier[];
  actions?: {
    booking?: boolean;
    contact?: boolean;
  };
}

export interface VideoMemoryExperience extends Experience {
  mediaType: "video";
  status: "past";
  video: string;
}

export interface UpcomingEventExperience extends Experience {
  status: "upcoming" | "live";
  date: string;
  venue: string;
  price?: Price;
  prices?: PriceTier[];
}