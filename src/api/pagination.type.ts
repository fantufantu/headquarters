export interface PaginateBy {
  page: number
  limit: number
}

export interface Paginated<T> {
  items: T[]
  total: number
}
