import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Who } from "./user.types";
import type { Authorization } from "./authorization.types";

/**
 * @description
 * 查询当前用户信息
 */
export const APP_CONFIG: TypedDocumentNode<{ whoAmI: Who; authorizedList: Authorization[] }> = gql`
  query AppConfig {
    whoAmI {
      id
      username
      nickname
      avatar
      emailAddress
    }
    authorizedList {
      resourceCode
      actionCode
    }
  }
`;
