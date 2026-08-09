import { Table, Pagination, Loading, Button, Popconfirm, Notification } from "musae";
import { useQuery } from "@apollo/client/react";
import { DISTRICTS } from "../../api/district.api";
import { usePagination } from "../../hooks/pagination.hooks";
import type { District } from "../../api/district.types";
import { useColumns } from "./hooks";
import EditableDrawer, { type EditableDrawerRef } from "../../components/district/editable-drawer";
import { useRef } from "react";
import { useEvent } from "@aiszlab/relax";
import { useSync } from "./sync.hook";

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
    // diff result is stored in state, Popconfirm will show it
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button onClick={add}>新增行政区</Button>
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
      </div>

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
