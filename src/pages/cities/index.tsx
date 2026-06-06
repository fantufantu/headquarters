import { Table, Pagination, Loading, Button } from "musae";
import { useQuery } from "@apollo/client/react";
import { CITIES } from "../../api/city.api";
import { usePagination } from "../../hooks/pagination.hooks";
import type { City } from "../../api/city.types";
import { useColumns } from "./hooks";
import EditableDrawer, { type EditableDrawerRef } from "../../components/city/editable-drawer";
import { useRef } from "react";
import { useEvent } from "@aiszlab/relax";

const Cities = () => {
  const { page, changePage, changeLimit, limit } = usePagination();
  const {
    data: { cities: { items: cities = [], total = 0 } = {} } = {},
    loading,
    refetch: _refetch,
  } = useQuery(CITIES, {
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
    <>
      <div>
        <Button onClick={add}>新增城市</Button>
      </div>

      <Table<City> columns={columns} bordered dataSource={cities} loading={loading} />

      <Pagination
        at={page}
        pageSize={limit}
        total={total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />

      <EditableDrawer ref={ref} onSubmitted={refetch} />
    </>
  );
};

export default Cities;
