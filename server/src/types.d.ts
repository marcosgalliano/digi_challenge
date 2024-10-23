export interface Person {
  name: string;
  height: number;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: Date;
  edited: Date;
  url: string;
}

export interface Films {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: Date;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: Date;
  edited: Date;
  url: string;
}

export interface Starships {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: number;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: Date;
  edited: Date;
  url: string;
}

export interface Planets {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: number;
  residents: string[];
  films: string[];
  created: Date;
  edited: Date;
  url: string;
}

// QUERYS

export interface PlanetQuery {
  name?: { $regex: RegExp };
  population?:
    | number
    | { $lt?: number; $lte?: number; $gt?: number; $gte?: number };
}

export interface PeopleQuery {
  name?: { $regex: RegExp };
  height?:
    | string
    | {
        $lt?: number;
        $lte?: number;
        $gt?: number;
        $gte?: number;
        $eq?: number;
      };
  mass?: string;
}

export interface StarshipQuery {
  name?: { $regex: RegExp };
  cost_in_credits?: {
    $lt?: number;
    $gt?: number;
    $lte?: number;
    $gte?: number;
  };
}

export interface FilmQuery {
  title?: { $regex: RegExp };
  release_date?: {
    $lt?: Date;
    $lte?: Date;
    $gt?: Date;
    $gte?: Date;
  };
}

// RESPONSES

export interface PeopleApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}

export interface PlanetsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planets[];
}

export interface StarshipsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Starships[];
}
