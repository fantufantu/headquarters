import { gql, TypedDocumentNode } from "@apollo/client";
import { Authorization } from "./authorization.types";

/**
 * 查询用户已授权的权限范围
 */
export const AUTHORIZED: TypedDocumentNode<{ authorized: Authorization[] }> = gql`
  query Authorized {
    authorized {
      resourceCode
      actionCode
    }
  }
`;
