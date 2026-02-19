import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Paginated, Pagination } from "./pagination.types";
import type { Role } from "./role.types";

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
