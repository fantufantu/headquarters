import { gql, TypedDocumentNode } from "@apollo/client";
import { Paginated, Pagination } from "./pagination.types";
import { Authorization } from "./authorization.types";

/**
 * 分页查询权限点列表
 */
export const PAGINATE_AUTHORIZATIONS: TypedDocumentNode<
  { paginateAuthorizations: Paginated<Authorization> },
  {
    pagination?: Pagination;
  }
> = gql`
  query PaginateAuthorizations($pagination: Pagination) {
    paginateAuthorizations(pagination: $pagination) {
      items {
        id
        resourceCode
        actionCode
      }
      total
    }
  }
`;

/**
 * 创建权限
 */
export const CREATE_AUTHORIZATION: TypedDocumentNode<
  { createAuthorization: Authorization },
  {
    input: {
      tenantCode: string;
      resourceCode: string;
      actionCode: string;
    };
  }
> = gql`
  mutation CreateAuthorization($input: CreateAuthorizationInput!) {
    createAuthorization(input: $input) {
      id
    }
  }
`;

/**
 * 删除权限
 */
export const REMOVE_AUTHORIZATION: TypedDocumentNode<
  { removeAuthorization: boolean },
  {
    id: number;
  }
> = gql`
  mutation RemoveAuthorization($id: Int!) {
    removeAuthorization(id: $id)
  }
`;
