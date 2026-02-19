import type { Role } from "@/api/role.types";
import { Button, Space } from "musae";
import type { Column } from "musae/types/table";
import { useMemo } from "react";

interface Props {
  onSuceess?: () => void;
}

export const useColumns = ({}: Props) => {
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
        render: () => {
          return (
            <Space>
              <Button size="small">分配权限</Button>
            </Space>
          );
        },
      },
    ];
  }, []);
};
