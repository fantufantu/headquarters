export interface Category {
  id: number
  code: string
  name: string
  image: string
}

export interface FilterCategoriesBy {
  keyword?: string
}

export interface CreateCategoryBy {
  code: string
  name: string
  image: string
}

export type UpdateCategoryBy = Partial<CreateCategoryBy>
