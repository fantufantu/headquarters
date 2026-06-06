/**
 * 高德地图 API 密钥
 */
export interface AmapCredential {
  /** 高德地图 API 密钥 */
  apiKey: string;
}

/**
 * 高德行政区域数据结构
 */
export interface District {
  /** 区域编码 */
  adcode: string;
  /** 区域中心点 */
  center: string;
  /** 下级行政区列表 */
  districts: District[];
  /** 行政区级别 */
  level: string;
  /** 行政区名称 */
  name: string;
}
