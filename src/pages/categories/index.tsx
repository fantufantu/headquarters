import { Table, Pagination, Loading, Button } from "musae";
import { useCategories } from "../../hooks/category.hooks";
import type { Category } from "../../api/category.types";
import { useColumns } from "./hooks";
import EditableDrawer, { type EditableDrawerRef } from "../../components/category/editable-drawer";
import { useRef } from "react";
import { useEvent } from "@aiszlab/relax";

const Categories = () => {
  const {
    categories,
    changePage,
    changeLimit,
    page,
    isLoading,
    limit,
    total,
    refetch: _refetch,
  } = useCategories();

  const ref = useRef<EditableDrawerRef>(null);

  const refetch = useEvent(() => {
    changePage(1);
  });

  const columns = useColumns({
    editableRef: ref,
    refetch,
  });

  const add = useEvent(() => {
    ref.current?.open();
  });

  return (
    <Loading className="flex flex-col gap-4" loading={isLoading}>
      <div>
        <Button onClick={add}>新增分类</Button>
      </div>

      <Table<Category> columns={columns} bordered dataSource={categories} />

      <Pagination
        at={page}
        pageSize={limit}
        total={total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />

      <EditableDrawer ref={ref} onSubmitted={refetch} />
    </Loading>
  );
};

export default Categories;
