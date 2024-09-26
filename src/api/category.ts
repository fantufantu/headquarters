import { gql, TypedDocumentNode } from '@apollo/client'
import type { Category, CreateCategoryBy, FilterCategoriesBy } from './category.type'
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
  query Categories($filterBy: FilterArticleCategoriesBy, $paginateBy: PaginateBy) {
    articleCategories(filterBy: $filterBy, paginateBy: $paginateBy) {
      items {
        code
        name
      }
      total
    }
  }
`

/**
 * @description
 * 根据id查询分类详情
 */
export const CATEGORY: TypedDocumentNode<
  { articleCategory: Category },
  {
    id: number
  }
> = gql`
  query Category($id: Int!) {
    articleCategory(id: $id) {
      code
      name
    }
  }
`

/**
 * @description
 * 创建分类
 */
export const CREATE_CATEGORY: TypedDocumentNode<
  { createArticleCategory: Category },
  {
    createArticleCategoryBy: CreateCategoryBy
  }
> = gql`
  mutation CreateCategory($code: String!, $name: String!) {
    createArticleCategory(code: $code, name: $name) {
      code
      name
    }
  }
`
