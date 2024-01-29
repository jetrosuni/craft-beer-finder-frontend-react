export interface Venue {
  readonly id?: number;
  readonly name: string;
  readonly daysAgo: number;
}

export interface Beer {
  readonly beerId: number;
  readonly name: string;
  readonly country: string;
  readonly style: string;
  readonly styleName: string;
  readonly rating: number;
  readonly ratingCount: number;
  readonly venues: Readonly<Venue[]>;
}

export interface BeerStyles {
  light: string[];
  dark: string[];
  sour: string[];
  other: string[];
}

export type BeerStyleName = "light" | "dark" | "sour" | "other";
export interface FilterValues {
  searchBeerString: string;
  searchVenueString: string;
  dayLimit: number;
  ratingMin: number;
  beerStylesAll: BeerStyleName[];
  beerStylesSelected: BeerStyleName[];
}
