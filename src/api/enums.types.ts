/** 后端枚举定义。key 对应 GraphQL 枚举，value 对应业务中的实际值。 */
export const RESOURCE_CODE = {
  ARTICLE: "article",
  CATEGORY: "category",
  RESUME_TEMPLATE: "resume_template",
  ISSUE: "issue",
  AUTHORIZATION: "authorization",
  ROLE: "role",
  USER: "user",
  DISTRICT: "district",
  ATTRACTION: "attraction",
  ALL: "all",
} as const;

export type ResourceCode = keyof typeof RESOURCE_CODE;

export const ACTION_CODE = {
  CREATE: "Create",
  READ: "Read",
  UPDATE: "Update",
  DELETE: "Delete",
  ALL: "All",
} as const;

export type ActionCode = keyof typeof ACTION_CODE;

export type BucketName = "FANTU" | "KNOWTHY";

export const DISTRICT_LEVEL = {
  PROVINCE: "province",
  CITY: "city",
} as const;

export const TENANT_CODE = {
  KNOWTHY: "knowthy",
  FANTU: "fantu",
  HEADQUARTERS: "headquarters",
} as const;

export type TenantCode = keyof typeof TENANT_CODE;
