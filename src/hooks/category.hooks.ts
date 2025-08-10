import { useQuery } from "@apollo/client";
import { usePagination } from "./pagination.hooks";
import { CATEGORIES } from "../api/category";
import { useCallback } from "react";

/**
 * @description
 * 分类列表的查询逻辑
 * 1. 通用的分页逻辑
 * 2. 通用的关键字搜索
 */
export const useCategories = () => {
  const { page, changePage, changeLimit, limit } = usePagination();

  const {
    data: { articleCategories: { items: categories = [], total = 0 } = {} } = {},
    refetch,
    loading,
  } = useQuery(CATEGORIES, {
    variables: {
      pagination: {
        limit,
        page,
      },
    },
  });

  const search = useCallback(
    (_keyword: string) => {
      refetch({
        filter: {
          keyword: _keyword,
        },
      });
    },
    [refetch],
  );

  return {
    categories,
    page,
    limit,
    changePage,
    changeLimit,
    search,
    isLoading: loading,
    total,
    refetch,
  };
};
