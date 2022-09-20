export type Coordinates = [number, number];

export type ComponentPropsT = {
  class: string;
  style?: string;
}

export type CityT = {
  slug: string;
  address: string;
  displayName: string;
  imageName?: string;
  mapCoordinates: Coordinates;
  popos?: PopoT[]
}

export type PopoT = {
  name: string;
  imageName?: string;
  featured?: boolean;
  openingHours: string;
  address?: string;
  vetted?: boolean;
  mapCoordinates: Coordinates;
  description: string;
  citySlug?: string;
  authorNote?: string;
  tags?: string[];
  rating?: number;
}

export type DatasetT = {
  version: number;
  cities: CityT[]
}

export interface PopoLinkT {
  url: string | null;
  name: string;
}