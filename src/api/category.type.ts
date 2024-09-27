export interface Category {
  code: string
  name: string
}

export interface FilterCategoriesBy {
  keyword?: string
}

export interface CreateCategoryBy {
  code: string
  name: string
}

export type UpdateCategoryBy = Partial<CreateCategoryBy>
