import { gql, TypedDocumentNode } from "@apollo/client";
import type {
  Category,
  CreateCategoryInput,
  FilterCategoriesInput,
  UpdateCategoryInput,
} from "./category.types";
import type { Pagination, Paginated } from "./pagination.types";

/**
 * @description
 * 查询分类列表
 */
export const CATEGORIES: TypedDocumentNode<
  { articleCategories: Paginated<Category> },
  {
    filter?: FilterCategoriesInput;
    pagination?: Pagination;
  }
> = gql`
  query Categories($filter: FilterArticleCategoriesInput, $pagination: Pagination) {
    articleCategories(filter: $filter, pagination: $pagination) {
      items {
        code
        name
        image
      }
      total
    }
  }
`;

/**
 * @description
 * 根据id查询分类详情
 */
export const CATEGORY: TypedDocumentNode<
  { articleCategory: Category },
  {
    code: string;
  }
> = gql`
  query Category($code: String!) {
    articleCategory(code: $code) {
      code
      name
      image
    }
  }
`;

/**
 * @description
 * 创建分类
 */
export const CREATE_CATEGORY: TypedDocumentNode<
  { createArticleCategory: Category },
  {
    input: CreateCategoryInput;
  }
> = gql`
  mutation CreateCategory($input: CreateArticleCategoryInput!) {
    createArticleCategory(input: $input) {
      code
      name
    }
  }
`;

/**
 * @description
 * 更新分类
 */
export const UPDATE_CATEGORY: TypedDocumentNode<
  { updateArticleCategory: Category },
  {
    code: string;
    input: UpdateCategoryInput;
  }
> = gql`
  mutation UpdateCategory($id: Int!, $input: UpdateArticleCategoryInput!) {
    updateArticleCategory(id: $id, input: $input)
  }
`;

/**
 * @description
 * 删除分类
 */
export const REMOVE_CATEGORY: TypedDocumentNode<
  { removeArticleCategory: boolean },
  { code: string }
> = gql`
  mutation RemoveCategory($code: String!) {
    removeArticleCategory(code: $code)
  }
`;
