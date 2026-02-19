/**
 * 系统权限资源
 */
export const RESOURCE_CODES = {
  /**
   * 文章
   */
  ARTICLE: "article",

  /**
   * 分类
   */
  CATEGORY: "category",

  /**
   * 简历模板
   */
  RESUME_TEMPLATE: "resume_template",

  /**
   * issue
   */
  ISSUE: "issue",

  /**
   * 全部资源
   */
  ALL: "all",
};

/**
 * 系统权限资源元数据
 */
export const RESOURCES = new Map([
  [RESOURCE_CODES.ARTICLE, { label: "文章", value: RESOURCE_CODES.ARTICLE }],
  [RESOURCE_CODES.CATEGORY, { label: "分类", value: RESOURCE_CODES.CATEGORY }],
  [RESOURCE_CODES.RESUME_TEMPLATE, { label: "简历模板", value: RESOURCE_CODES.RESUME_TEMPLATE }],
  [RESOURCE_CODES.ISSUE, { label: "issue", value: RESOURCE_CODES.ISSUE }],
  [RESOURCE_CODES.ALL, { label: "全部", value: RESOURCE_CODES.ALL }],
]);

/**
 * 系统权限操作
 */
export const ACTION_CODES = {
  CREATE: "Create",
  READ: "Read",
  UPDATE: "Update",
  DELETE: "Delete",
  ALL: "All",
};

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
