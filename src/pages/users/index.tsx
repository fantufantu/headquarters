import { useQuery } from "@apollo/client/react";
import { USERS } from "../../api/user";
import { usePagination } from "../../hooks/pagination.hooks";
import { Loading, Pagination, Table } from "musae";
import { Who } from "../../api/user.types";
import { useColumns } from "./hooks/use-column";
import UserRoleAssigner, { UserRoleAssignerRef } from "@/components/user/role-assigner";
import { useRef } from "react";

/**
 * 用户中心
 */
const Users = () => {
  const userRoleAssignerRef = useRef<UserRoleAssignerRef>(null);
  const { page, changePage, changeLimit, limit } = usePagination();
  const { data, loading } = useQuery(USERS, {
    variables: {
      pagination: {
        page,
        limit,
      },
    },
  });

  const columns = useColumns({ userRoleAssignerRef });

  return (
    <Loading className="flex flex-col gap-4" loading={loading}>
      <Table<Who> columns={columns} bordered dataSource={data?.paginateUsers.items} />

      <Pagination
        at={page}
        pageSize={limit}
        total={data?.paginateUsers.total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />

      <UserRoleAssigner ref={userRoleAssignerRef} />
    </Loading>
  );
};

export default Users;
