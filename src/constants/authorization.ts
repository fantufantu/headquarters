import type { ActionCode, ResourceCode } from "@/api/enums.types";

/**
 * 系统权限资源
 */
export const RESOURCE_CODES = {
  ARTICLE: "ARTICLE",
  CATEGORY: "CATEGORY",
  RESUME_TEMPLATE: "RESUME_TEMPLATE",
  ISSUE: "ISSUE",
  AUTHORIZATION: "AUTHORIZATION",
  ROLE: "ROLE",
  USER: "USER",
  DISTRICT: "DISTRICT",
  ATTRACTION: "ATTRACTION",
  ALL: "ALL",
} as const satisfies Record<ResourceCode, ResourceCode>;

/**
 * 系统权限资源元数据
 */
export const RESOURCES = new Map([
  [RESOURCE_CODES.ARTICLE, { label: "文章", value: RESOURCE_CODES.ARTICLE }],
  [RESOURCE_CODES.CATEGORY, { label: "分类", value: RESOURCE_CODES.CATEGORY }],
  [RESOURCE_CODES.RESUME_TEMPLATE, { label: "简历模板", value: RESOURCE_CODES.RESUME_TEMPLATE }],
  [RESOURCE_CODES.ISSUE, { label: "issue", value: RESOURCE_CODES.ISSUE }],
  [RESOURCE_CODES.AUTHORIZATION, { label: "权限", value: RESOURCE_CODES.AUTHORIZATION }],
  [RESOURCE_CODES.ROLE, { label: "角色", value: RESOURCE_CODES.ROLE }],
  [RESOURCE_CODES.USER, { label: "用户", value: RESOURCE_CODES.USER }],
  [RESOURCE_CODES.DISTRICT, { label: "行政区", value: RESOURCE_CODES.DISTRICT }],
  [RESOURCE_CODES.ATTRACTION, { label: "景点", value: RESOURCE_CODES.ATTRACTION }],
  [RESOURCE_CODES.ALL, { label: "全部", value: RESOURCE_CODES.ALL }],
]);

/**
 * 系统权限操作
 */
export const ACTION_CODES = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ALL: "ALL",
} as const satisfies Record<ActionCode, ActionCode>;

/**
 * 系统权限操作元数据
 */
export const ACTIONS = new Map([
  [ACTION_CODES.CREATE, { label: "创建", value: ACTION_CODES.CREATE }],
  [ACTION_CODES.READ, { label: "读取", value: ACTION_CODES.READ }],
  [ACTION_CODES.UPDATE, { label: "更新", value: ACTION_CODES.UPDATE }],
  [ACTION_CODES.DELETE, { label: "删除", value: ACTION_CODES.DELETE }],
  [ACTION_CODES.ALL, { label: "全部", value: ACTION_CODES.ALL }],
]);
