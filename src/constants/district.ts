/**
 * 行政区层级
 */
export { DISTRICT_LEVEL } from "./enums";

import { DISTRICT_LEVEL } from "./enums";

/**
 * 行政区层级名称
 */
export const DISTRICT_LEVEL_LABELS = new Map<string, string>([
  [DISTRICT_LEVEL.PROVINCE, "省"],
  [DISTRICT_LEVEL.CITY, "市"],
]);
