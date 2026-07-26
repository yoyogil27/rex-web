// types/organization.ts
import type { Experience } from "./experience";

export type OrganizationType =
  | "Hotel"
  | "Resort"
  | "Restaurant"
  | "Cafe"
  | "Tour"
  | "Event"
  | "Eco Lodge"
  | "Art & Culture"
  | "Lodge"
  | "Attraction"
  | "Activity"
  | "Bar"
  | "Nightlife"
  | "Shopping"
  | "Spa"
  | "Wellness";

export type OrganizationStatus = "pending" | "approved" | "rejected" | "suspended";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description?: string;
  verified: boolean;
  status: OrganizationStatus;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  logo?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string; // Reference to user who owns this organization
  isOnboarded: boolean;
}

export interface OrganizationApplication {
  id: string;
  userId: string;
  organizationName: string;
  type: OrganizationType;
  description: string;
  phone: string;
  email: string;
  website?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface OrganizationDashboard {
  organization: Organization;
  stats: {
    totalViews: number;
    totalSaves: number;
    totalShares: number;
    totalExperiences: number;
    totalPlaces: number;
    recentActivity: {
      id: string;
      type: 'view' | 'save' | 'share' | 'booking';
      count: number;
      date: string;
    }[];
  };
}