import type { Column } from "musae/types/table";
import { useMemo, type RefObject } from "react";
import type { Attraction } from "../../api/attraction.types";
import { Button, Divider, Popconfirm, Space, Image, useMessage } from "musae";
import { type EditableDrawerRef } from "../../components/attraction/editable-drawer";
import { useMutation } from "@apollo/client/react";
import { DELETE_ATTRACTION } from "../../api/attraction.api";

export const useColumns = ({
  editableRef,
  refetch,
}: {
  editableRef: RefObject<EditableDrawerRef | null>;
  refetch: VoidFunction;
}) => {
  const [_delete] = useMutation(DELETE_ATTRACTION);
  const [messager] = useMessage();

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
              <Divider orientation="vertical" />
              <Popconfirm
                title="请确认"
                content="确认删除当前景点"
                onConfirm={async () => {
                  const isSucceed = !!(await _delete({ variables: { code } })).data
                    ?.deleteAttraction;
                  if (!isSucceed) return;
                  messager.success({ description: "删除成功！" });
                  refetch();
                }}
              >
                <Button variant="text" size="small">
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }, [_delete, editableRef, messager, refetch]);
};
