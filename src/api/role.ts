import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Paginated, Pagination } from "./pagination.types";
import type { AssignAuthorizationsInput, Role } from "./role.types";

/**
 * 分页查询角色列表
 */
export const PAGINATE_ROLES: TypedDocumentNode<
  { paginateRoles: Paginated<Role> },
  {
    pagination?: Pagination;
  }
> = gql`
  query PaginateRoles($pagination: Pagination) {
    paginateRoles(pagination: $pagination) {
      items {
        code
        name
      }
      total
    }
  }
`;

/**
 * 创建角色
 */
export const CREATE_ROLE: TypedDocumentNode<
  { createRole: Role },
  { input: { code: string; name: string } }
> = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      code
      name
    }
  }
`;

/**
 * 查询角色详情
 */
export const ROLE: TypedDocumentNode<{ role: Role }, { code: string }> = gql`
  query Role($code: String!) {
    role(code: $code) {
      code
      name
    }
  }
`;

/**
 * 查询角色权限
 */
export const ROLE_AUTHORIZATIONS: TypedDocumentNode<{ role: Role }, { code: string }> = gql`
  query Role($code: String!) {
    role(code: $code) {
      authorizations {
        id
        resourceCode
        actionCode
      }
    }
  }
`;

/**
 * 为角色授权
 */
export const ASSIGN_AUTHORIZATIONS: TypedDocumentNode<
  { assignAuthorizations: Role },
  { input: AssignAuthorizationsInput }
> = gql`
  mutation AssignAuthorizations($input: AssignAuthorizationsInput!) {
    assignAuthorizations(input: $input)
  }
`;
