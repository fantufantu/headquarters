import { gql, TypedDocumentNode } from "@apollo/client";
import { Paginated, Pagination } from "./pagination.types";
import { Authorization } from "./authorization.types";

/**
 * 分页查询权限点列表
 */
export const PAGINATE_AUTHORIZATIONS: TypedDocumentNode<
  { paginatedAuthorizations: Paginated<Authorization> },
  {
    pagination?: Pagination;
  }
> = gql`
  query PaginateAuthorizations($pagination: Pagination) {
    paginateAuthorizations(pagination: $pagination) {
      items {
        id
      }
      total
    }
  }
`;
