import { ACTION_CODE, RESOURCE_CODE } from "./enums";

/**
 * 系统权限资源元数据
 */
export const RESOURCES = new Map([
  [RESOURCE_CODE.ARTICLE, { label: "文章", value: RESOURCE_CODE.ARTICLE }],
  [RESOURCE_CODE.CATEGORY, { label: "分类", value: RESOURCE_CODE.CATEGORY }],
  [RESOURCE_CODE.RESUME_TEMPLATE, { label: "简历模板", value: RESOURCE_CODE.RESUME_TEMPLATE }],
  [RESOURCE_CODE.ISSUE, { label: "issue", value: RESOURCE_CODE.ISSUE }],
  [RESOURCE_CODE.AUTHORIZATION, { label: "权限", value: RESOURCE_CODE.AUTHORIZATION }],
  [RESOURCE_CODE.ROLE, { label: "角色", value: RESOURCE_CODE.ROLE }],
  [RESOURCE_CODE.USER, { label: "用户", value: RESOURCE_CODE.USER }],
  [RESOURCE_CODE.DISTRICT, { label: "行政区", value: RESOURCE_CODE.DISTRICT }],
  [RESOURCE_CODE.ATTRACTION, { label: "景点", value: RESOURCE_CODE.ATTRACTION }],
  [RESOURCE_CODE.ALL, { label: "全部", value: RESOURCE_CODE.ALL }],
]);

/**
 * 系统权限操作元数据
 */
export const ACTIONS = new Map([
  [ACTION_CODE.CREATE, { label: "创建", value: ACTION_CODE.CREATE }],
  [ACTION_CODE.READ, { label: "读取", value: ACTION_CODE.READ }],
  [ACTION_CODE.UPDATE, { label: "更新", value: ACTION_CODE.UPDATE }],
  [ACTION_CODE.DELETE, { label: "删除", value: ACTION_CODE.DELETE }],
  [ACTION_CODE.ALL, { label: "全部", value: ACTION_CODE.ALL }],
]);
