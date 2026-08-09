import type { Column } from "musae/types/table";
import { useMemo, type RefObject } from "react";
import type { District } from "../../api/district.types";
import { Button, Space } from "musae";
import { type EditableDrawerRef } from "../../components/district/editable-drawer";

export const useColumns = ({
  editableRef,
}: {
  editableRef: RefObject<EditableDrawerRef | null>;
}) => {
  return useMemo<Column<District>[]>(() => {
    return [
      {
        valueAt: "code",
        title: "行政区编码",
      },
      {
        valueAt: "name",
        title: "行政区名称",
      },
      {
        valueAt: "level" as keyof District,
        title: "层级",
        render: (_: unknown, record: District) => {
          return record.level === "province" ? "省" : record.level === "city" ? "市" : record.level;
        },
      },
      {
        valueAt: "attractionCount",
        title: "景区数量",
      },
      {
        key: "actions",
        title: "操作",
        render: (_, { code }) => {
          return (
            <Space>
              <Button variant="text" size="small" onClick={() => editableRef.current?.open(code)}>
                编辑
              </Button>
            </Space>
          );
        },
      },
    ];
  }, [editableRef]);
};
