/**
 * 系统内置租户
 */
export const TENANT_CODE = {
  // 知己知彼：简历站点
  KNOWTHY: "knowthy",
} as const;

/**
 * 系统内置租户元数据
 */
export const TENANTS = new Map([
  [TENANT_CODE.KNOWTHY, { label: "简历站点", value: TENANT_CODE.KNOWTHY }],
]);
