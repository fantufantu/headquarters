export interface Attraction {
  code: string;
  name: string;
  cityCode: string;
  image: string;
  city: {
    code: string;
    name: string;
  };
}

export interface FilterAttractionsInput {
  keyword?: string;
}

export interface CreateAttractionInput {
  code: string;
  name: string;
  cityCode: string;
  image: string;
}

export type UpdateAttractionInput = Partial<CreateAttractionInput>;
