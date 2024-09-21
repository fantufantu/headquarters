import { gql, TypedDocumentNode } from '@apollo/client'
import type { Category, FilterCategoriesBy } from './category.type'
import type { PaginateBy, Paginated } from './pagination.type'

/**
 * @description
 * 查询分类列表
 */
export const GET_CATEGORIES: TypedDocumentNode<
  { articleCategories: Paginated<Category> },
  {
    filterBy?: FilterCategoriesBy
    paginateBy?: PaginateBy
  }
> = gql`
  query GetCategories($filterBy: FilterArticleCategoriesBy, $paginateBy: PaginateBy) {
    articleCategories(filterBy: $filterBy, paginateBy: $paginateBy) {
      items {
        code
        name
      }
      total
    }
  }
`
