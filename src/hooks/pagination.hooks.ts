import { useCallback, useState } from 'react'

/**
 * @description
 * pagination
 */
export const usePagination = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const changePage = useCallback((_page: number) => {
    setPage(_page)
  }, [])

  const changeLimit = useCallback((_limit: number) => {
    setLimit(_limit)
  }, [])

  return {
    page,
    limit,
    changePage,
    changeLimit
  }
}
