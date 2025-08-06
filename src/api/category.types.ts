export interface Category {
  code: string;
  name: string;
  image: string;
}

export interface FilterCategoriesInput {
  keyword?: string;
}

export interface CreateCategoryInput {
  code: string;
  name: string;
  image: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
