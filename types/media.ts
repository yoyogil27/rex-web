export type MediaType =
  | "video"
  | "image";


export interface Media {

  id: string;

  type: MediaType;

  url: string;

  thumbnail?: string;

  duration?: number;

  creatorId?: string;

}