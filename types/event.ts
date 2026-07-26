import type { Experience } from "./experience";


export interface Event {

  id: string;

  title: string;

  description: string;


  startDate: string;

  endDate: string;


  location: string;


  experiences: Experience[];

}