import { useCallback, useState } from 'react'

/**
 * @description
 * pagination
 */
export const usePagination = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const onPageChange = useCallback((_page: number) => {
    setPage(_page)
  }, [])

  const onPageSizeChange = useCallback((_pageSize: number) => {
    setPageSize(_pageSize)
  }, [])

  return {
    page,
    pageSize,
    onPageChange,
    onPageSizeChange
  }
}
