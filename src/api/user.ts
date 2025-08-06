import { gql, TypedDocumentNode } from "@apollo/client";
import type { UpdateUserBy } from "./user.types";

/**
 * @description
 * 更新用户信息，目前仅支持更新昵称
 */
export const UPDATE_USER: TypedDocumentNode<
  {
    updateUser: boolean;
  },
  {
    updateUserBy: UpdateUserBy;
  }
> = gql`
  mutation UpdateUser($updateUserBy: UpdateUserBy!) {
    updateUser(input: $updateUserBy)
  }
`;
