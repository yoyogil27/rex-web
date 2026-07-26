import type { Place } from "./place";


export interface Stay {

  id: string;

  place: Place;


  amenities: string[];


  bookingUrl?: string;

}