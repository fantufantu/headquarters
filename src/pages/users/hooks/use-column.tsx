import { RefObject, useMemo } from "react";
import type { Column } from "musae/types/table";
import { Who } from "../../../api/user.types";
import { Button, Space } from "musae";
import { UserRoleAssignerRef } from "@/components/user/role-assigner";

/**
 * 文章列表列配置
 */
export const useColumns = ({
  userRoleAssignerRef,
}: {
  userRoleAssignerRef: RefObject<UserRoleAssignerRef | null>;
}) => {
  return useMemo<Column<Who>[]>(() => {
    return [
      {
        valueAt: "username",
        title: "用户名",
      },
      {
        valueAt: "nickname",
        title: "用户昵称",
      },
      {
        valueAt: "emailAddress",
        title: "用户邮箱地址",
      },
      {
        title: "操作",
        render: (_v, record) => {
          return (
            <Space>
              <Button
                variant="text"
                size="xsmall"
                onClick={() => userRoleAssignerRef.current?.open(record.id)}
              >
                分配角色
              </Button>
            </Space>
          );
        },
      },
    ];
  }, [userRoleAssignerRef]);
};
