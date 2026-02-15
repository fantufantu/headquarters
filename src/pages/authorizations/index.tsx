import { PAGINATE_AUTHORIZATIONS } from "@/api/authorization";
import AuthorizationEditor, { AuthorizationEditorRef } from "@/components/authorization/editor";
import { usePagination } from "@/hooks/pagination.hooks";
import { useQuery } from "@apollo/client/react";
import { Button, Table } from "musae";
import { useRef } from "react";

const Authorizations = () => {
  const { page, changePage, changeLimit, limit } = usePagination();
  const { data: { paginatedAuthorizations: { items: authorizations = [], total = 0 } = {} } = {} } =
    useQuery(PAGINATE_AUTHORIZATIONS, {
      variables: {
        pagination: {
          page,
          limit,
        },
      },
    });

  const authorizationEditorRef = useRef<AuthorizationEditorRef>(null);

  const add = () => {
    authorizationEditorRef.current?.open();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button onClick={add}>创建权限点</Button>
      </div>

      <Table
        dataSource={authorizations}
        columns={[
          {
            valueAt: "id",
            title: "ID",
          },
        ]}
      />

      <AuthorizationEditor ref={authorizationEditorRef} />
    </div>
  );
};

export default Authorizations;
