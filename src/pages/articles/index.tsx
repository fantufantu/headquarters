import { Table, Button, Pagination, Loading } from 'musae'
import type { Article } from '../../api/article.type'
import { useColumns } from './hooks'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { ARTICLES } from '../../api/article'
import { usePagination } from '../../hooks/pagination.hooks'
import { useEvent } from '@aiszlab/relax'

const Articles = () => {
  const navigate = useNavigate()

  const { page, onPageChange, onPageSizeChange, pageSize } = usePagination()
  const {
    loading,
    data: { articles: { items: articles, total } } = { articles: { items: [], total: 0 } },
    refetch: _refetch
  } = useQuery(ARTICLES, {
    variables: {
      paginateBy: {
        page,
        limit: pageSize
      }
    }
  })

  const refetch = useEvent(() => {
    const _page = 1
    onPageChange(_page)
    _refetch({ paginateBy: { page: _page, limit: pageSize } })
  })

  const columns = useColumns({
    refetch
  })

  const toAdd = useCallback(() => {
    navigate('/articles/add')
  }, [navigate])

  return (
    <Loading className='flex flex-col gap-4' loading={loading}>
      <div>
        <Button onClick={toAdd}>新增文章</Button>
      </div>

      <Table<Article> columns={columns} bordered dataSource={articles} />

      <Pagination
        at={page}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Loading>
  )
}

export default Articles
