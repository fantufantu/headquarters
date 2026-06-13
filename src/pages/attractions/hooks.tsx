import type { Column } from "musae/types/table";
import { useMemo, type RefObject } from "react";
import type { Attraction } from "../../api/attraction.types";
import { Button, Space, Image } from "musae";
import { type EditableDrawerRef } from "../../components/attraction/editable-drawer";

export const useColumns = ({
  editableRef,
}: {
  editableRef: RefObject<EditableDrawerRef | null>;
}) => {
  return useMemo<Column<Attraction>[]>(() => {
    return [
      {
        valueAt: "code",
        title: "景点编码",
      },
      {
        valueAt: "name",
        title: "景点名称",
      },
      {
        key: "image",
        title: "图片",
        width: 120,
        render: (_, { image }) => <Image src={image} width={160} height={120} />,
      },
      {
        valueAt: "city.name",
        title: "城市",
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
