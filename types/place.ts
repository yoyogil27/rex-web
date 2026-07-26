// types/place.ts
import type { Experience } from "./experience";
import type { Organization } from "./organization";

export interface Place {
  id: string;
  name: string;
  location: string;
  description: string;
  coverVideo: string;
  organizationId: string;
  organization?: Organization;
  category?: string;
  rating?: number;
  amenities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  experiences: Experience[];
}

// Simplified place for past events
export interface SimplePlace {
  id: string;
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}