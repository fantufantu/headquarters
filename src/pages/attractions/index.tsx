import { Table, Pagination, Button } from "musae";
import { useQuery } from "@apollo/client/react";
import { ATTRACTIONS } from "../../api/attraction.api";
import { usePagination } from "../../hooks/pagination.hooks";
import type { Attraction } from "../../api/attraction.types";
import { useColumns } from "./hooks";
import EditableDrawer, {
  type EditableDrawerRef,
} from "../../components/attraction/editable-drawer";
import { useRef } from "react";
import { useEvent } from "@aiszlab/relax";

const Attractions = () => {
  const { page, changePage, changeLimit, limit } = usePagination();
  const {
    data: { attractions: { items: attractions = [], total = 0 } = {} } = {},
    loading,
    refetch: _refetch,
  } = useQuery(ATTRACTIONS, {
    variables: {
      pagination: {
        limit,
        page,
      },
    },
  });

  const ref = useRef<EditableDrawerRef>(null);

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

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button onClick={add}>新增景点</Button>
      </div>

      <Table<Attraction> columns={columns} bordered dataSource={attractions} loading={loading} />

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

export default Attractions;
