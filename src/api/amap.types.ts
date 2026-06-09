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

/**
 * 高德 POI 数据结构
 */
export interface Poi {
  /** 区域编码 */
  adcode: string;
  /** 地址 */
  address: string;
  /** 行政区名称 */
  adname: string;
  /** 城市编码 */
  citycode: string;
  /** 城市名称 */
  cityname: string;
  /** 距离 */
  distance: string;
  /** POI ID */
  id: string;
  /** 坐标 */
  location: string;
  /** POI 名称 */
  name: string;
  /** 父级 POI ID */
  parent: string;
  /** 省份编码 */
  pcode: string;
  /** 省份名称 */
  pname: string;
  /** POI 类型 */
  type: string;
  /** POI 类型编码 */
  typecode: string;
}
