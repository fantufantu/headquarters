import { useQuery } from "@apollo/client/react";
import { USERS } from "../../api/user";
import { usePagination } from "../../hooks/pagination.hooks";
import { Loading, Pagination, Table } from "musae";
import { Who } from "../../api/user.types";
import { useColumns } from "./hooks/use-column";

/**
 * 用户中心
 */
const Users = () => {
  const { page, changePage, changeLimit, limit } = usePagination();
  const { data, loading } = useQuery(USERS, {
    variables: {
      pagination: {
        page,
        limit,
      },
    },
  });

  const columns = useColumns();

  return (
    <Loading className="flex flex-col gap-4" loading={loading}>
      <Table<Who> columns={columns} bordered dataSource={data?.articles.items} />

      <Pagination
        at={page}
        pageSize={limit}
        total={data?.articles.total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />
    </Loading>
  );
};

export default Users;
