import { useState, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useEvent } from "@aiszlab/relax";
import type { AmapDistrict } from "@/api/amap.types";
import type { District } from "@/api/district.types";
import { queryDistricts } from "@/api/amap.api";
import { DISTRICTS, SYNC_DISTRICTS } from "@/api/district.api";

/** 高德树打平后的扁平结构 */
export interface FlatDistrict {
  code: string;
  name: string;
  level: string;
  parentCode: string;
}

/** 修改项：同时保留新旧名称 */
export interface ModifiedDistrict extends FlatDistrict {
  oldName: string;
}

/** Diff 结果 */
export interface SyncDiff {
  added: FlatDistrict[];
  modified: ModifiedDistrict[];
  deleted: District[];
  snapshot: FlatDistrict[];
}

/** 表格展示用的统一行类型 */
export interface SyncRow {
  changeType: "added" | "modified" | "deleted";
  code: string;
  name: string;
  oldName?: string;
  level: District["level"];
  parentCode: string;
}

/** 将 diff 结果转换为表格展示用的统一行 */
export function toSyncRows(diff: SyncDiff): SyncRow[] {
  const added: SyncRow[] = diff.added.map((d) => ({
    changeType: "added",
    code: d.code,
    name: d.name,
    level: d.level,
    parentCode: d.parentCode,
  }));

  const modified: SyncRow[] = diff.modified.map((d) => ({
    changeType: "modified",
    code: d.code,
    name: d.name,
    oldName: d.oldName,
    level: d.level,
    parentCode: d.parentCode,
  }));

  const deleted: SyncRow[] = diff.deleted.map((d) => ({
    changeType: "deleted",
    code: d.code,
    name: d.name,
    level: d.level,
    parentCode: d.parentCode ?? "",
  }));

  return [...added, ...modified, ...deleted];
}

/**
 * 递归打平高德行政区域树，保留高德返回的全部层级
 * @param districts - 高德返回的 AmapDistrict 数组
 * @param parentCode - 父级 adcode（省份的父级是国家 adcode）
 */
function flattenDistricts(districts: AmapDistrict[], parentCode?: string): FlatDistrict[] {
  const result: FlatDistrict[] = [];

  for (const district of districts) {
    result.push({
      code: district.adcode,
      name: district.name,
      level: district.level,
      parentCode: parentCode ?? "",
    });

    if (district.districts?.length) {
      result.push(...flattenDistricts(district.districts, district.adcode));
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
function diffDistricts(amapData: FlatDistrict[], dbData: District[]): SyncDiff {
  const dbMap = new Map(dbData.map((c) => [c.code, c]));
  const amapSet = new Set(amapData.map((d) => d.code));

  const added: FlatDistrict[] = [];
  const modified: ModifiedDistrict[] = [];

  for (const district of amapData) {
    const existing = dbMap.get(district.code);
    if (!existing) {
      added.push(district);
    } else if (existing.name !== district.name) {
      modified.push({ ...district, oldName: existing.name });
    }
  }

  const deleted = dbData.filter((district) => !amapSet.has(district.code));

  return { added, modified, deleted, snapshot: amapData };
}

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [diff, setDiff] = useState<SyncDiff | null>(null);

  const [fetchDistricts] = useLazyQuery(DISTRICTS);
  const [syncDistricts] = useMutation(SYNC_DISTRICTS);

  /** Step 1+2+3: 拉取数据、打平、diff，返回 diff 结果（不执行同步） */
  const analyze = useEvent(async (): Promise<SyncDiff | null> => {
    // 并行拉取两端数据
    const [dbResult, amapDistricts] = await Promise.all([
      fetchDistricts().catch(() => null),
      queryDistricts({ keywords: "中国", subdistrict: 3 }).catch(() => null),
    ]);

    // 后端接口未实现时异常，当作空数据处理
    const dbDistricts: District[] = dbResult?.data?.districts?.items ?? [];

    if (!amapDistricts?.length) return null;

    const flatDistricts = flattenDistricts(amapDistricts);

    const result = diffDistricts(flatDistricts, dbDistricts);
    setDiff(result);
    return result;
  });

  /** Step 4: 执行同步 */
  const execute = useEvent(async (diff: SyncDiff) => {
    setSyncing(true);
    setProgress({ current: 0, total: 1 });

    try {
      await syncDistricts({ variables: { input: diff.snapshot } });
      setProgress({ current: 1, total: 1 });
      setDiff(null);
    } finally {
      setSyncing(false);
      setProgress({ current: 0, total: 0 });
    }
  });

  const resetDiff = useCallback(() => setDiff(null), []);

  return { syncing, progress, diff, analyze, execute, resetDiff };
}
