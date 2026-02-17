import { PAGINATE_AUTHORIZATIONS } from "@/api/authorization";
import AuthorizationEditor, { AuthorizationEditorRef } from "@/components/authorization/editor";
import { usePagination } from "@/hooks/pagination.hooks";
import { useQuery } from "@apollo/client/react";
import { Button, Table } from "musae";
import { useRef } from "react";
import { useColumns } from "./hooks/use-columns";
import { useEvent } from "@aiszlab/relax";

const Authorizations = () => {
  const { page, changePage, changeLimit, limit } = usePagination();
  const {
    data: { paginateAuthorizations: { items: authorizations = [], total = 0 } = {} } = {},
    refetch: _refetch,
  } = useQuery(PAGINATE_AUTHORIZATIONS, {
    variables: {
      pagination: {
        page,
        limit,
      },
    },
  });

  const refetch = useEvent(() => {
    _refetch();
  });

  const authorizationEditorRef = useRef<AuthorizationEditorRef>(null);
  const columns = useColumns({ onSuceess: refetch });

  const add = () => {
    authorizationEditorRef.current?.open();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button onClick={add}>创建权限点</Button>
      </div>

      <Table dataSource={authorizations} columns={columns} />

      <AuthorizationEditor ref={authorizationEditorRef} onSuccess={refetch} />
    </div>
  );
};

export default Authorizations;
