export interface City {
  code: string;
  name: string;
  image: string;
  attractionCount?: number;
}

export interface FilterCitiesInput {
  keyword?: string;
}

export interface CreateCityInput {
  code: string;
  name: string;
  image: string;
}

export type UpdateCityInput = Partial<CreateCityInput>;
