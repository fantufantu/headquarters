import { ACTION_CODE, RESOURCE_CODE } from "@/constants/enums";

/**
 * 检查当前权限点是否被授权
 */
export const isAuthorized = (
  authorized: Map<string, Set<string>> | undefined,
  {
    actionCode = ACTION_CODE.READ,
    resourceCode,
  }: {
    resourceCode: string;
    actionCode?: string;
  },
) => {
  return (
    (authorized?.get(resourceCode)?.has(actionCode) ||
      authorized?.get(resourceCode)?.has(ACTION_CODE.ALL) ||
      authorized?.get(RESOURCE_CODE.ALL)?.has(actionCode) ||
      authorized?.get(RESOURCE_CODE.ALL)?.has(ACTION_CODE.ALL)) ??
    false
  );
};
