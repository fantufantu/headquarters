import { PAGINATE_ROLES } from "@/api/role";
import { usePagination } from "@/hooks/pagination.hooks";
import { useQuery } from "@apollo/client/react";
import { Button, Table } from "musae";
import { useColumns } from "./hooks/use-columns";
import RoleEditor, { RoleEditorRef } from "@/components/role/editor";
import { useRef } from "react";

/**
 * 角色管理页面
 */
const Roles = () => {
  const editorRef = useRef<RoleEditorRef>(null);
  const { page, limit } = usePagination();
  const { data: { paginateRoles: { items: roles = [], total = 0 } = {} } = {} } = useQuery(
    PAGINATE_ROLES,
    {
      variables: {
        pagination: {
          page,
          limit,
        },
      },
    },
  );

  const columns = useColumns({});

  const add = () => {
    editorRef.current?.open();
  };

  return (
    <div>
      <div>
        <Button onClick={add}>新增角色</Button>
      </div>

      <Table dataSource={roles} columns={columns} />

      <RoleEditor ref={editorRef} />
    </div>
  );
};

export default Roles;
