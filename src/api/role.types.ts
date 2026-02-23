import { Authorization } from "./authorization.types";

/**
 * 角色
 */
export type Role = {
  code: string;
  name: string;
  authorizations?: Authorization[];
};

/**
 * 为角色分配权限
 */
export type AssignAuthorizationsInput = {
  roleCode: string;
  authorizationIds: number[];
};
