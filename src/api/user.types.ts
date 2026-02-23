import { type Authorization } from "./authorization.types";

export interface Who {
  id: number;
  username: string;
  avatar?: string;
  nickname?: string;
  emailAddress: string;
  authorizations?: Authorization[];
}

/**
 * 更新用户信息`dto`
 */
export interface UpdateUserInput {
  nickname: string;
  avatar?: string | null;
}

/**
 * 为用户分配角色
 */
export interface AssignRolesInput {
  userId: number;
  roleCodes: string[];
}
