export interface City {
  code: string;
  name: string;
  level: string;
  parentCode?: string;
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
  level?: string;
  parentCode?: string;
}

export type UpdateCityInput = Partial<CreateCityInput>;
