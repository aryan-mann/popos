export type Coordinates = [number, number];

export type City = {
  slug: string;
  displayName: string;
  mapCoordinates: Coordinates;
  popos?: Popo[]
}

export type Popo = {
  name: string;
  openingHours: string;
  mapCoordinates: Coordinates;
  description: string;
}

export type Dataset = {
  version: number;
  cities: City[]
}