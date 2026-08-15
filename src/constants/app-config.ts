/**
 * 系统内置租户
 */
export { TENANT_CODE } from "@/api/enums.types";

import { TENANT_CODE } from "@/api/enums.types";

/**
 * 系统内置租户元数据
 */
export const TENANTS = new Map([
  [TENANT_CODE.KNOWTHY, { label: "知己知彼（简历站点）", value: TENANT_CODE.KNOWTHY }],
  [TENANT_CODE.FANTU, { label: "番土番土（个人站点）", value: TENANT_CODE.FANTU }],
  [TENANT_CODE.HEADQUARTERS, { label: "驾驶舱（管理站点）", value: TENANT_CODE.HEADQUARTERS }],
]);
