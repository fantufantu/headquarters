export interface City {
  code: string;
  name: string;
  image: string;
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
