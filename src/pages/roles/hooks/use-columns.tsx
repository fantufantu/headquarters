import type { Role } from "@/api/role.types";
import { type RoleAuthorizationEditorRef } from "@/components/role/authorization-editor";
import { type RoleEditorRef } from "@/components/role/editor";
import { Button, Space } from "musae";
import type { Column } from "musae/types/table";
import { type RefObject, useMemo } from "react";

interface Props {
  onSuceess?: () => void;
  editorRef: RefObject<RoleEditorRef | null>;
  authorizationEditorRef: RefObject<RoleAuthorizationEditorRef | null>;
}

export const useColumns = ({ authorizationEditorRef, editorRef }: Props) => {
  return useMemo<Column<Role>[]>(() => {
    return [
      {
        valueAt: "code",
        title: "角色编码",
      },
      {
        valueAt: "name",
        title: "角色名称",
      },
      {
        title: "操作",
        render: (_v, record) => {
          return (
            <Space>
              <Button
                size="small"
                variant="text"
                onClick={() => {
                  editorRef.current?.open(record.code);
                }}
              >
                编辑
              </Button>

              <Button
                size="small"
                variant="text"
                onClick={() => {
                  authorizationEditorRef.current?.open(record.code);
                }}
              >
                分配权限
              </Button>
            </Space>
          );
        },
      },
    ];
  }, []);
};
