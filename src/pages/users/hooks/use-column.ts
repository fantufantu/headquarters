import { useMemo } from "react";
import type { Column } from "musae/types/table";
import { Who } from "../../../api/user.types";

/**
 * 文章列表列配置
 */
export const useColumns = () => {
  return useMemo<Column<Who>[]>(() => {
    return [
      {
        valueAt: "nickname",
        title: "用户昵称",
      },
      {
        valueAt: "emailAddress",
        title: "用户邮箱地址",
      },
    ];
  }, []);
};
