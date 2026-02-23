import { ACTION_CODES, RESOURCE_CODES } from "@/constants/authorization";

/**
 * 检查当前权限点是否被授权
 */
export const isAuthorized = (
  authorized: Map<string, Set<string>> | undefined,
  {
    actionCode = ACTION_CODES.READ,
    resourceCode,
  }: {
    resourceCode: string;
    actionCode?: string;
  },
) => {
  return (
    (authorized?.get(resourceCode)?.has(actionCode) ||
      authorized?.get(resourceCode)?.has(ACTION_CODES.ALL) ||
      authorized?.get(RESOURCE_CODES.ALL)?.has(actionCode) ||
      authorized?.get(RESOURCE_CODES.ALL)?.has(ACTION_CODES.ALL)) ??
    false
  );
};
