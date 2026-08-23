export interface Attraction {
  code: string;
  name: string;
  districtCode: string;
  image: string;
  district: {
    code: string;
    name: string;
  };
}

export interface FilterAttractionsInput {
  keyword?: string;
  districtCode?: string;
}

export interface CreateAttractionInput {
  code: string;
  name: string;
  districtCode: string;
  image: string;
}

export interface UpdateAttractionInput {
  image?: string;
}
