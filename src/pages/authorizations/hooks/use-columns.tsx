import { REMOVE_AUTHORIZATION } from "@/api/authorization";
import type { Authorization } from "@/api/authorization.types";
import { useApolloClient } from "@apollo/client/react";
import { Button, Popconfirm } from "musae";
import type { Column } from "musae/types/table";
import { useMemo } from "react";

interface Props {
  onSuceess?: () => void;
}

export const useColumns = ({ onSuceess }: Props) => {
  const client = useApolloClient();

  return useMemo<Column<Authorization>[]>(() => {
    return [
      {
        valueAt: "id",
        title: "ID",
      },
      {
        valueAt: "resourceCode",
        title: "资源",
      },
      {
        valueAt: "actionCode",
        title: "动作",
      },
      {
        title: "操作",
        render: (_v, record) => {
          return (
            <Popconfirm
              content="确定删除吗？"
              onConfirm={async () => {
                const { data: { removeAuthorization: isSucceed } = {} } = await client.mutate({
                  mutation: REMOVE_AUTHORIZATION,
                  variables: {
                    id: record.id,
                  },
                });

                if (!isSucceed) return;
                onSuceess?.();
              }}
            >
              <Button color="error" variant="text" size="small">
                删除
              </Button>
            </Popconfirm>
          );
        },
      },
    ];
  }, []);
};
