# 城市数据同步功能设计

## 概述

在城市管理页面增加「同步」功能：从高德地图拉取全国行政区域树（省+市），与后端已有数据做 diff，分析出新增、修改、删除，然后逐条调用现有 mutation 同步到后端。

## 数据模型变更

### City 类型扩展 (`src/api/city.types.ts`)

```ts
export interface City {
  code: string;
  name: string;
  level: string;        // 新增: "province" | "city"
  parentCode?: string;  // 新增: 父级行政区code
  image: string;
  attractionCount?: number;
}

export interface CreateCityInput {
  code: string;
  name: string;
  level: string;        // 新增
  parentCode?: string;  // 新增
  image: string;
}

export type UpdateCityInput = Partial<CreateCityInput>;
```

### 新增 DELETE_CITY mutation (`src/api/city.api.ts`)

```graphql
mutation DeleteCity($code: String!) {
  deleteCity(code: $code)
}
```

## 同步流程

### Step 1 — 拉取数据源

- **后端数据**: 使用现有 `CITIES` query，不加 `pagination` 参数，获取全部城市
- **高德数据**: `queryDistricts({ keywords: "中国", subdistrict: 2 })` 获取完整的省→市树

### Step 2 — 打平高德树

递归遍历 `District` 树，过滤 `level === "province"` 和 `level === "city"`，产出扁平数组：

```ts
interface FlatDistrict {
  code: string;       // adcode
  name: string;
  level: string;
  parentCode: string; // 父级 adcode
}
```

### Step 3 — Diff

以 `code` 为唯一键做 Map 匹配：

| 条件 | 结果 |
|------|------|
| Amap 有，DB 无 | 新增 |
| 两边都有，`name` 不同 | 修改 |
| DB 有，Amap 无 | 删除 |
| 两边都有，`name` 相同 | 无变化 |

### Step 4 — 同步执行

前端逐条循环调用：

- 新增 → `CREATE_CITY` mutation
- 修改 → `UPDATE_CITY` mutation（只更新 name）
- 删除 → `DELETE_CITY` mutation

同步过程中显示进度（如 "同步中 45/120"）。

### Step 5 — 刷新

全部完成后 refetch 城市列表，Notification 提示结果。

## UI

- 城市列表页顶部新增「同步数据」按钮（「新增城市」旁边）
- 点击后弹出确认框，展示 diff 摘要（新增/修改/删除各多少条）
- 确认后按钮进入 loading 状态，显示进度
- 完成后自动刷新表格，弹出成功提示
