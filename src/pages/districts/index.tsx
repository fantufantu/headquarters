import { Table, Pagination, Button, SideSheet, Tag, Notification } from "musae";
import { useQuery } from "@apollo/client/react";
import { DISTRICTS } from "../../api/district.api";
import { usePagination } from "../../hooks/pagination.hooks";
import type { District } from "../../api/district.types";
import type { Column } from "musae/types/table";
import { useColumns } from "./hooks";
import EditableDrawer, { type EditableDrawerRef } from "../../components/district/editable-drawer";
import { useRef } from "react";
import { useEvent } from "@aiszlab/relax";
import { useSync, toSyncRows, type SyncRow } from "./sync.hook";
import { DISTRICT_LEVEL_LABELS } from "@/constants/district";

const Districts = () => {
  const { page, changePage, changeLimit, limit } = usePagination();
  const {
    data: { districts: { items: districts = [], total = 0 } = {} } = {},
    loading,
    refetch: _refetch,
  } = useQuery(DISTRICTS, {
    variables: {
      pagination: {
        limit,
        page,
      },
    },
  });

  const ref = useRef<EditableDrawerRef>(null);
  const { syncing, progress, diff, analyze, execute, resetDiff } = useSync();

  const refetch = useEvent(() => {
    changePage(1);

    _refetch({
      pagination: {
        page: 1,
        limit,
      },
    });
  });

  const columns = useColumns({
    editableRef: ref,
  });

  const add = useEvent(() => {
    ref.current?.open();
  });

  const handleSyncClick = useEvent(async () => {
    await analyze();
  });

  const handleSyncConfirm = useEvent(async () => {
    if (!diff) return;
    await execute(diff);
    refetch();
    Notification.success({
      title: "同步完成",
      description: `新增 ${diff.added.length}，修改 ${diff.modified.length}，删除 ${diff.deleted.length}`,
    });
  });

  const diffColumns: Column<SyncRow>[] = [
    {
      key: "changeType",
      title: "变更类型",
      render: (_: unknown, record: SyncRow) => {
        const config = {
          added: { label: "新增", color: "#52c41a" },
          modified: { label: "修改", color: "#fa8c16" },
          deleted: { label: "删除", color: "#ff4d4f" },
        }[record.changeType];
        return <Tag style={{ color: config.color }}>{config.label}</Tag>;
      },
    },
    {
      valueAt: "code",
      title: "行政区编码",
    },
    {
      key: "name",
      title: "行政区名称",
      render: (_: unknown, record: SyncRow) => {
        if (record.changeType === "modified") {
          return (
            <span>
              {record.oldName} → {record.name}
            </span>
          );
        }
        return <span>{record.name}</span>;
      },
    },
    {
      key: "level",
      title: "层级",
      render: (_: unknown, record: SyncRow) => {
        return DISTRICT_LEVEL_LABELS.get(record.level) ?? record.level;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button onClick={add}>新增行政区</Button>
        <Button onClick={handleSyncClick} loading={syncing}>
          同步数据
        </Button>
      </div>

      <SideSheet
        title={syncing ? `同步中... ${progress.current}/${progress.total}` : "同步确认"}
        open={!!diff}
        onClose={resetDiff}
        onConfirm={handleSyncConfirm}
        closable={!syncing}
        size={800}
      >
        <Table<SyncRow> columns={diffColumns} bordered dataSource={diff ? toSyncRows(diff) : []} />
      </SideSheet>

      <Table<District> columns={columns} bordered dataSource={districts} loading={loading} />

      <Pagination
        at={page}
        pageSize={limit}
        total={total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />

      <EditableDrawer ref={ref} onSubmitted={refetch} />
    </div>
  );
};

export default Districts;
