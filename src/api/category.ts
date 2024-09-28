import { gql, TypedDocumentNode } from '@apollo/client'
import type { Category, CreateCategoryBy, FilterCategoriesBy, UpdateCategoryBy } from './category.type'
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
        id
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
    createBy: CreateCategoryBy
  }
> = gql`
  mutation CreateCategory($createBy: CreateArticleCategoryBy!) {
    createArticleCategory(createBy: $createBy) {
      code
      name
    }
  }
`

/**
 * @description
 * 更新分类
 */
export const UPDATE_CATEGORY: TypedDocumentNode<
  { updateArticleCategory: Category },
  {
    id: number
    updateBy: UpdateCategoryBy
  }
> = gql`
  mutation UpdateCategory($id: Int!, $updateBy: UpdateArticleCategoryBy!) {
    updateArticleCategory(id: $id, updateBy: $updateBy)
  }
`

/**
 * @description
 * 删除分类
 */
export const REMOVE_CATEGORY: TypedDocumentNode<{ removeArticleCategory: boolean }, { id: number }> = gql`
  mutation RemoveCategory($id: Int!) {
    removeArticleCategory(id: $id)
  }
`
