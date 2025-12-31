import { useMemo } from "react";
import type { Article } from "../../api/article.types";
import type { Column } from "musae/types/table";
import { Space, Popconfirm, Button, useMessage, Divider } from "musae";
import { useNavigate } from "@aiszlab/bee/router";
import { REMOVE_ARTICLE } from "../../api/article";
import { useMutation } from "@apollo/client/react";

/**
 * 文章列表列配置
 */
export const useColumns = ({ refetch }: { refetch: () => void }) => {
  const navigate = useNavigate();
  const [_remove] = useMutation(REMOVE_ARTICLE);
  const [messager] = useMessage();

  return useMemo<Column<Article>[]>(() => {
    return [
      {
        valueAt: "id",
        title: "ID",
      },
      {
        valueAt: "title",
        title: "标题",
      },
      {
        key: "opeartions",
        title: "操作",
        render: (_, { id }) => {
          return (
            <Space>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  navigate(`/articles/edit/${id}`);
                }}
              >
                编辑
              </Button>
              <Divider orientation="vertical" />
              <Popconfirm
                title="确定删除吗？"
                content="删除后不可恢复"
                onConfirm={async () => {
                  const isSucceed = (await _remove({ variables: { id } }).catch(() => null))?.data
                    ?.removeArticle;
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
  }, [_remove, messager, navigate, refetch]);
};
