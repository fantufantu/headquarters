import { Table, Button, Pagination, Loading } from "musae";
import type { Article } from "../../api/article.types";
import { useColumns } from "./hooks";
import { useNavigate } from "@aiszlab/bee/router";
import { useCallback } from "react";
import { useQuery } from "@apollo/client";
import { ARTICLES } from "../../api/article";
import { usePagination } from "../../hooks/pagination.hooks";
import { useEvent } from "@aiszlab/relax";

const Articles = () => {
  const navigate = useNavigate();

  const { page, changePage, changeLimit, limit } = usePagination();
  const {
    loading,
    data: { articles: { items: articles, total } } = { articles: { items: [], total: 0 } },
    refetch: _refetch,
  } = useQuery(ARTICLES, {
    variables: {
      pagination: {
        page,
        limit,
      },
    },
  });

  const refetch = useEvent(() => {
    const _page = 1;
    changeLimit(_page);
    _refetch({ pagination: { page: _page, limit } });
  });

  const columns = useColumns({
    refetch,
  });

  const toAdd = useCallback(() => {
    navigate("/articles/add");
  }, [navigate]);

  return (
    <Loading className="flex flex-col gap-4" loading={loading}>
      <div>
        <Button onClick={toAdd}>新增文章</Button>
      </div>

      <Table<Article> columns={columns} bordered dataSource={articles} />

      <Pagination
        at={page}
        pageSize={limit}
        total={total}
        onChange={changePage}
        onPageSizeChange={changeLimit}
      />
    </Loading>
  );
};

export default Articles;
