export interface Pagination {
  page: number;
  limit: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}
