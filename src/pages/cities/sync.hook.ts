import { useState, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useEvent } from "@aiszlab/relax";
import type { District } from "@/api/amap.types";
import type { City } from "@/api/city.types";
import { queryDistricts } from "@/api/amap.api";
import {
  CITIES,
  CREATE_CITY,
  UPDATE_CITY,
  DELETE_CITY,
} from "@/api/city.api";

/** 高德树打平后的扁平结构 */
export interface FlatDistrict {
  code: string;
  name: string;
  level: string;
  parentCode: string;
}

/** Diff 结果 */
export interface SyncDiff {
  added: FlatDistrict[];
  modified: FlatDistrict[];
  deleted: City[];
}

/**
 * 递归打平高德行政区域树，只保留 province 和 city 层级
 * @param districts - 高德返回的 District 数组
 * @param parentCode - 父级 adcode（省份的父级是国家 adcode）
 */
function flattenDistricts(
  districts: District[],
  parentCode?: string,
): FlatDistrict[] {
  const result: FlatDistrict[] = [];

  for (const district of districts) {
    if (district.level === "province" || district.level === "city") {
      result.push({
        code: district.adcode,
        name: district.name,
        level: district.level,
        parentCode: parentCode ?? "",
      });
    }

    if (district.districts?.length) {
      result.push(
        ...flattenDistricts(district.districts, district.adcode),
      );
    }
  }

  return result;
}

/**
 * 以 code 为唯一键对比高德数据和数据库数据
 * - Amap 有、DB 无 → 新增
 * - 两边都有、name 不同 → 修改
 * - DB 有、Amap 无 → 删除
 */
function diffCities(
  amapData: FlatDistrict[],
  dbData: City[],
): SyncDiff {
  const dbMap = new Map(dbData.map((c) => [c.code, c]));
  const amapSet = new Set(amapData.map((d) => d.code));

  const added: FlatDistrict[] = [];
  const modified: FlatDistrict[] = [];

  for (const district of amapData) {
    const existing = dbMap.get(district.code);
    if (!existing) {
      added.push(district);
    } else if (existing.name !== district.name) {
      modified.push(district);
    }
  }

  const deleted = dbData.filter(
    (c) => !amapSet.has(c.code) && (c.level === "province" || c.level === "city"),
  );

  return { added, modified, deleted };
}

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [diff, setDiff] = useState<SyncDiff | null>(null);

  const [fetchCities] = useLazyQuery(CITIES);
  const [createCity] = useMutation(CREATE_CITY);
  const [updateCity] = useMutation(UPDATE_CITY);
  const [deleteCity] = useMutation(DELETE_CITY);

  /** Step 1+2+3: 拉取数据、打平、diff，返回 diff 结果（不执行同步） */
  const analyze = useEvent(async (): Promise<SyncDiff | null> => {
    // 并行拉取两端数据
    const [dbResult, amapDistricts] = await Promise.all([
      fetchCities().catch(() => null),
      queryDistricts({ keywords: "中国", subdistrict: 2 }).catch(() => null),
    ]);

    if (!dbResult?.data?.cities?.items) return null;
    const dbCities: City[] = dbResult.data.cities.items;

    if (!amapDistricts?.length) return null;

    // 高德返回的第一项是"中国"（country 层级），
    // 其 districts 字段是省级列表
    const china = amapDistricts[0];
    const flatDistricts = flattenDistricts(
      china.districts ?? [],
      china.adcode,
    );

    const result = diffCities(flatDistricts, dbCities);
    setDiff(result);
    return result;
  });

  /** Step 4: 执行同步 */
  const execute = useEvent(async (diff: SyncDiff) => {
    const { added, modified, deleted } = diff;
    const total = added.length + modified.length + deleted.length;
    let current = 0;

    setSyncing(true);
    setProgress({ current: 0, total });

    // 新增
    for (const item of added) {
      await createCity({
        variables: {
          input: {
            code: item.code,
            name: item.name,
            level: item.level,
            parentCode: item.parentCode,
            image: "",
          },
        },
      }).catch(() => null);
      current++;
      setProgress({ current, total });
    }

    // 修改
    for (const item of modified) {
      await updateCity({
        variables: {
          code: item.code,
          input: { name: item.name },
        },
      }).catch(() => null);
      current++;
      setProgress({ current, total });
    }

    // 删除
    for (const item of deleted) {
      await deleteCity({
        variables: { code: item.code },
      }).catch(() => null);
      current++;
      setProgress({ current, total });
    }

    setSyncing(false);
    setProgress({ current: 0, total: 0 });
    setDiff(null);
  });

  const resetDiff = useCallback(() => setDiff(null), []);

  return { syncing, progress, diff, analyze, execute, resetDiff };
}
