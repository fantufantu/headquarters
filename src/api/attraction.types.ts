export interface Attraction {
  code: string;
  name: string;
  cityCode: string;
}

export interface FilterAttractionsInput {
  keyword?: string;
}

export interface CreateAttractionInput {
  code: string;
  name: string;
  cityCode: string;
}

export type UpdateAttractionInput = Partial<Pick<CreateAttractionInput, "name" | "cityCode">>;
