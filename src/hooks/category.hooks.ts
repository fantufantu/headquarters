import { useQuery } from '@apollo/client'
import { usePagination } from './pagination.hooks'
import { GET_CATEGORIES } from '../api/category'
import { useCallback } from 'react'

/**
 * @description
 * 分类列表的查询逻辑
 * 1. 通用的分页逻辑
 * 2. 通用的关键字搜索
 */
export const useCategories = () => {
  const { page, onPageChange, onPageSizeChange, pageSize } = usePagination()

  const {
    data: { articleCategories: { items: categories = [], total = 0 } = {} } = {},
    refetch,
    loading
  } = useQuery(GET_CATEGORIES, {
    variables: {
      paginateBy: {
        limit: pageSize,
        page
      }
    }
  })

  const onSearch = useCallback(
    (_keyword: string) => {
      refetch({
        filterBy: {
          keyword: _keyword
        }
      })
    },
    [refetch]
  )

  return {
    categories,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isLoading: loading,
    total,
    refetch
  }
}
