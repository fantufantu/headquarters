# City Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Sync" button to the city page that fetches the Amap district tree (province + city), diffs against existing DB data using `code` as key, and syncs additions/modifications/deletions via existing + new mutations.

**Architecture:** Pure frontend feature — fetch data from two sources (DB via GraphQL, Amap via REST), flatten the Amap tree, diff in-memory with Map-based matching, then loop through changes calling individual mutations with progress tracking. Uses existing `CREATE_CITY` / `UPDATE_CITY` mutations plus a new `DELETE_CITY` mutation.

**Tech Stack:** React 19, TypeScript, Apollo Client, musae UI, @aiszlab/relax

## Global Constraints

- Sync only `province` and `city` levels from Amap district tree
- Use `code` (Amap `adcode`) as the unique matching key for diff
- Diff compares `name` only; `image` is never touched by sync
- Display diff summary (counts of added/modified/deleted) before user confirms
- Progress shown during sync (`同步中 45/120`)
- Existing `CITIES` query without pagination returns all cities for diff

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/api/city.types.ts` | Modify | Add `level`, `parentCode` to `City`, `CreateCityInput` |
| `src/api/city.api.ts` | Modify | Add `DELETE_CITY` mutation; add `level`/`parentCode` to all queries and mutations |
| `src/pages/cities/sync.hook.ts` | **Create** | `flattenDistricts()`, `diffCities()`, `useSync()` hook — core sync logic |
| `src/pages/cities/index.tsx` | Modify | Add sync button, confirmation, progress display |
| `src/pages/cities/hooks.tsx` | Modify | Add `level` column to table |

---

### Task 1: Update City types (`src/api/city.types.ts`)

**Files:**
- Modify: `src/api/city.types.ts`

**Interfaces:**
- Produces: `City { level: string; parentCode?: string }`, `CreateCityInput { level?: string; parentCode?: string }`

- [ ] **Step 1: Add `level` and `parentCode` to City interface**

```ts
export interface City {
  code: string;
  name: string;
  level: string;
  parentCode?: string;
  image: string;
  attractionCount?: number;
}
```

- [ ] **Step 2: Add `level` and `parentCode` to CreateCityInput (as optional — drawer doesn't need them)**

```ts
export interface CreateCityInput {
  code: string;
  name: string;
  image: string;
  level?: string;
  parentCode?: string;
}
```

`UpdateCityInput` is `Partial<CreateCityInput>` so it inherits the new optional fields automatically.

- [ ] **Step 3: Commit**

```bash
git add src/api/city.types.ts
git commit -m "feat: add level and parentCode to City types

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Update City API (`src/api/city.api.ts`)

**Files:**
- Modify: `src/api/city.api.ts`

**Interfaces:**
- Consumes: `City` with `level`, `parentCode` from Task 1
- Produces: `DELETE_CITY` TypedDocumentNode, updated `CITIES`/`CITY`/`CREATE_CITY`/`UPDATE_CITY` with new fields

- [ ] **Step 1: Add `level` and `parentCode` to CITIES query fields**

In `CITIES` gql template, add `level` and `parentCode` to the `items` selection:

```graphql
query Cities($filter: FilterCitiesInput, $pagination: Pagination) {
  cities(filter: $filter, pagination: $pagination) {
    items {
      code
      name
      level
      parentCode
      attractionCount
    }
    total
  }
}
```

- [ ] **Step 2: Add `level` and `parentCode` to CITY query fields**

In `CITY` gql template:

```graphql
query City($code: String!) {
  city(code: $code) {
    code
    name
    level
    parentCode
    image
  }
}
```

- [ ] **Step 3: Add `level` and `parentCode` to CREATE_CITY mutation**

In `CREATE_CITY` gql template:

```graphql
mutation CreateCity($input: CreateCityInput!) {
  createCity(input: $input)
}
```

The input type `CreateCityInput` already has the new fields from Task 1.

- [ ] **Step 4: Add `level` and `parentCode` to UPDATE_CITY mutation**

In `UPDATE_CITY` gql template:

```graphql
mutation UpdateCity($code: String!, $input: UpdateCityInput!) {
  updateCity(code: $code, input: $input)
}
```

The input type `UpdateCityInput` already inherits from updated `CreateCityInput`.

- [ ] **Step 5: Add DELETE_CITY mutation**

```ts
/**
 * @description 删除城市
 */
export const DELETE_CITY: TypedDocumentNode<
  { deleteCity: boolean },
  { code: string }
> = gql`
  mutation DeleteCity($code: String!) {
    deleteCity(code: $code)
  }
`;
```

- [ ] **Step 6: Commit**

```bash
git add src/api/city.api.ts
git commit -m "feat: add DELETE_CITY mutation and update city queries with level/parentCode

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Create sync hook (`src/pages/cities/sync.hook.ts`)

**Files:**
- Create: `src/pages/cities/sync.hook.ts`

**Interfaces:**
- Consumes: `District` from `@/api/amap.types`, `City` from `@/api/city.types`, `CITIES`/`CREATE_CITY`/`UPDATE_CITY`/`DELETE_CITY` from `@/api/city.api`, `queryDistricts` from `@/api/amap.api`
- Produces: `FlatDistrict`, `SyncDiff`, `useSync()` → `{ sync, syncing, progress, diff }`

- [ ] **Step 1: Write types for flattened district and diff result**

```ts
import type { District } from "@/api/amap.types";
import type { City } from "@/api/city.types";

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
```

- [ ] **Step 2: Write `flattenDistricts` function**

Recursively walk the Amap `District` tree, keep only `province` and `city` levels:

```ts
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
```

- [ ] **Step 3: Write `diffCities` function**

```ts
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

  const deleted = dbData.filter((c) => !amapSet.has(c.code));

  return { added, modified, deleted };
}
```

- [ ] **Step 4: Write `useSync` hook**

```ts
import { useState, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useEvent } from "@aiszlab/relax";
import { queryDistricts } from "@/api/amap.api";
import {
  CITIES,
  CREATE_CITY,
  UPDATE_CITY,
  DELETE_CITY,
} from "@/api/city.api";

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

    const dbCities: City[] =
      dbResult?.data?.cities?.items ?? [];

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
```

Note: the hook exports `analyze` and `execute` separately so the page can call `analyze` first to show the diff summary to the user, then call `execute` after confirmation.

- [ ] **Step 5: Commit**

```bash
git add src/pages/cities/sync.hook.ts
git commit -m "feat: add city sync hook with flatten, diff, and execute logic

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Update City page UI (`src/pages/cities/index.tsx` + `src/pages/cities/hooks.tsx`)

**Files:**
- Modify: `src/pages/cities/index.tsx`
- Modify: `src/pages/cities/hooks.tsx`

**Interfaces:**
- Consumes: `useSync` from `./sync.hook`, `Notification` from musae

- [ ] **Step 1: Add `level` column to table columns (`src/pages/cities/hooks.tsx`)**

Insert after `name` column:

```tsx
{
  valueAt: "level" as keyof City,
  title: "层级",
  render: (_: unknown, record: City) => {
    return record.level === "province" ? "省" : record.level === "city" ? "市" : record.level;
  },
},
```

- [ ] **Step 2: Add sync button and logic to page (`src/pages/cities/index.tsx`)**

Add imports:

```tsx
import { Button, Popconfirm } from "musae";
import { Notification } from "musae";
import { useSync } from "./sync.hook";
```

Add sync hook usage:

```tsx
const { syncing, progress, diff, analyze, execute, resetDiff } = useSync();
```

Add sync handler:

```tsx
const handleSyncClick = useEvent(async () => {
  const result = await analyze();
  // diff result is stored in state, Popconfirm will show it
});
```

Add sync confirmation handler:

```tsx
const handleSyncConfirm = useEvent(async () => {
  if (!diff) return;
  await execute(diff);
  refetch();
  Notification.success({
    title: "同步完成",
    content: `新增 ${diff.added.length}，修改 ${diff.modified.length}，删除 ${diff.deleted.length}`,
  });
});
```

Add sync button next to "新增城市" button:

```tsx
{!diff ? (
  <Button onClick={handleSyncClick} loading={syncing}>
    同步数据
  </Button>
) : (
  <Popconfirm
    title="同步确认"
    content={`新增 ${diff.added.length} 个省市，修改 ${diff.modified.length} 个，删除 ${diff.deleted.length} 个。确认同步？`}
    onConfirm={handleSyncConfirm}
    onCancel={resetDiff}
  >
    <Button>
      {syncing
        ? `同步中... ${progress.current}/${progress.total}`
        : `确认同步（${diff.added.length + diff.modified.length + diff.deleted.length}）`}
    </Button>
  </Popconfirm>
)}
```

- [ ] **Step 3: Check TypeScript compilation**

```bash
pnpm exec tsc --noEmit
```

Fix any type errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/cities/index.tsx src/pages/cities/hooks.tsx
git commit -m "feat: add sync button and progress display to city page

Co-Authored-By: Claude <noreply@anthropic.com>"
```
