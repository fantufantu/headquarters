import { useQuery } from '@apollo/client'
import { GET_CATEGORIES } from '../../../api/category'
import { usePagination } from '../../../hooks/pagination.hooks'
import { useCallback, useMemo, useState } from 'react'
import type { Option } from 'musae/types/option'

/**
 * @description
 * categories
 */
export const useCategories = () => {
  const { page, onPageChange, onPageSizeChange, pageSize } = usePagination()

  const { data: { articleCategories: { items: categories = [] } = {} } = {}, refetch } = useQuery(GET_CATEGORIES, {
    variables: {
      paginateBy: {
        limit: pageSize,
        page
      }
    }
  })

  const categoryOptions = useMemo<Option[]>(() => {
    return categories.map((_category) => {
      return {
        value: _category.code,
        label: _category.name
      }
    })
  }, [categories])

  const onSearch = useCallback((_keyword: string) => {
    refetch({
      filterBy: {
        keyword: _keyword
      }
    })
  }, [])

  return {
    categories,
    categoryOptions,
    page,
    onPageChange,
    onPageSizeChange,
    onSearch
  }
}
