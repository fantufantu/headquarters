import { gql, TypedDocumentNode } from "@apollo/client";
import type { UpdateUserInput, Who } from "./user.types";
import { Paginated, Pagination } from "./pagination.types";

/**
 * 更新用户信息，目前仅支持更新昵称
 */
export const UPDATE_USER: TypedDocumentNode<
  {
    updateUser: boolean;
  },
  {
    input: UpdateUserInput;
  }
> = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input)
  }
`;

/**
 * 分页查询用户列表
 */
export const USERS: TypedDocumentNode<
  { articles: Paginated<Who> },
  {
    pagination?: Pagination;
  }
> = gql`
  query Users($pagination: Pagination) {
    paginateUsers(pagination: $pagination) {
      items {
        id
        username
        avatar
        nickname
      }
      total
    }
  }
`;
