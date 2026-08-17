type ValueOf<T> = T[keyof T];

/** GraphQL `ResourceCode` 枚举。 */
export const RESOURCE_CODE = {
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
} as const;

export type ResourceCode = ValueOf<typeof RESOURCE_CODE>;

/** GraphQL `ActionCode` 枚举。 */
export const ACTION_CODE = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ALL: "ALL",
} as const;

export type ActionCode = ValueOf<typeof ACTION_CODE>;

/** GraphQL `BucketName` 枚举。 */
export const BUCKET_NAME = {
  FANTU: "FANTU",
  KNOWTHY: "KNOWTHY",
  CABIN_CAB: "CABIN_CAB",
} as const;

export type BucketName = ValueOf<typeof BUCKET_NAME>;

/** 高德行政区层级。 */
export const DISTRICT_LEVEL = {
  PROVINCE: "province",
  CITY: "city",
} as const;

/** GraphQL `TenantCode` 枚举。 */
export const TENANT_CODE = {
  KNOWTHY: "KNOWTHY",
  FANTU: "FANTU",
  HEADQUARTERS: "HEADQUARTERS",
} as const;

export type TenantCode = ValueOf<typeof TENANT_CODE>;
