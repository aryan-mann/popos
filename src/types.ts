export type Coordinates = number[];

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
  openingHours: string;
  mapCoordinates: Coordinates;
  description: string;
  citySlug?: string;
}

export type DatasetT = {
  version: number;
  cities: CityT[]
}

export interface PopoLinkT {
  url: string | null;
  name: string;
}