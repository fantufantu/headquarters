import type { Column } from "musae/types/table";
import { useMemo, type RefObject } from "react";
import type { City } from "../../api/city.types";
import { Button, Space } from "musae";
import { type EditableDrawerRef } from "../../components/city/editable-drawer";

export const useColumns = ({
  editableRef,
}: {
  editableRef: RefObject<EditableDrawerRef | null>;
}) => {
  return useMemo<Column<City>[]>(() => {
    return [
      {
        valueAt: "code",
        title: "城市编码",
      },
      {
        valueAt: "name",
        title: "城市名称",
      },
      {
        valueAt: "level" as keyof City,
        title: "层级",
        render: (_: unknown, record: City) => {
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
