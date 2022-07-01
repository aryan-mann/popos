export type Coordinates = [number, number];

export type City = {
  slug: string;
  address: string;
  displayName: string;
  mapCoordinates: Coordinates;
  popos?: Popo[]
}

export type Popo = {
  name: string;
  imageName?: string;
  openingHours: string;
  mapCoordinates: Coordinates;
  description: string;
  citySlug: string;
}

export type Dataset = {
  version: number;
  cities: City[]
}