/**
 * 行政区层级
 */
export const DISTRICT_LEVEL = {
  province: "province",
  city: "city",
} as const;

/**
 * 行政区层级名称
 */
export const DISTRICT_LEVEL_LABELS = new Map<string, string>([
  [DISTRICT_LEVEL.province, "省"],
  [DISTRICT_LEVEL.city, "市"],
]);
