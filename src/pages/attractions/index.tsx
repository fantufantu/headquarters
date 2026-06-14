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
import AttractionFilter, { type FilterRef } from "./filter";

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

  const editorRef = useRef<EditableDrawerRef>(null);
  const filterRef = useRef<FilterRef>(null);

  const handleSearch = useEvent(() => {
    const filter = filterRef.current?.getValues();
    changePage(1);

    _refetch({
      filter: { keyword: filter?.keyword, cityCode: filter?.cityCode },
      pagination: {
        page: 1,
        limit,
      },
    });
  });

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
    editableRef: editorRef,
    refetch,
  });

  const add = useEvent(() => {
    editorRef.current?.open();
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button onClick={add}>新增景点</Button>
      </div>

      <div className="flex items-center gap-4">
        <AttractionFilter ref={filterRef} />
        <Button onClick={handleSearch}>查询</Button>
      </div>

      <Table<Attraction> columns={columns} bordered dataSource={attractions} loading={loading} />

      <Pagination
        at={page}
        pageSize={limit}
        total={total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />

      <EditableDrawer ref={editorRef} onSubmitted={refetch} />
    </div>
  );
};

export default Attractions;
