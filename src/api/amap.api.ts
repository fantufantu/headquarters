import { gql, type TypedDocumentNode } from "@apollo/client";
import type { AmapCredential, District, Poi } from "./amap.types";
import { useAmapStore } from "@/store/amap.store";

/**
 * @description 获取高德地图认证信息
 */
export const AMAP_CREDENTIAL: TypedDocumentNode<{
  amapCredential: AmapCredential;
}> = gql`
  query AmapCredential {
    amapCredential {
      apiKey
    }
  }
`;

/**
 * @description 查询高德行政区域（支持模糊搜索）
 */
export async function queryDistricts({
  keywords,
  subdistrict = 0,
}: {
  keywords?: string;
  subdistrict?: 0 | 1 | 2 | 3;
}): Promise<District[] | undefined> {
  const apiKey = (await useAmapStore.state.loadCredential())?.apiKey;

  if (!apiKey) {
    throw new Error("无法获取高德地图 API 密钥");
  }

  const url = new URL("https://restapi.amap.com/v3/config/district");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("subdistrict", subdistrict.toString());

  if (keywords) {
    url.searchParams.set("keywords", keywords);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  return data.districts;
}

/**
 * @description 查询高德地图景点 POI
 */
export async function queryTouristAttractions({
  keywords,
  cityCode,
}: {
  keywords?: string;
  cityCode?: string;
}): Promise<Poi[]> {
  const apiKey = (await useAmapStore.state.loadCredential())?.apiKey;

  if (!apiKey) {
    throw new Error("无法获取高德地图 API 密钥");
  }

  const url = new URL("https://restapi.amap.com/v5/place/text");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("city_limit", "true");

  if (keywords) {
    url.searchParams.set("keywords", keywords);
  }

  if (cityCode) {
    url.searchParams.set("region", cityCode);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  return data.pois ?? [];
}
