export interface District {
  code: string;
  name: string;
  level: string;
  parentCode?: string;
  image: string;
  attractionCount?: number;
}

export interface FilterDistrictsInput {
  keyword?: string;
}

export interface CreateDistrictInput {
  code: string;
  name: string;
  image: string;
  level?: string;
  parentCode?: string;
}

export type UpdateDistrictInput = Partial<CreateDistrictInput>;
