import { Table, Button, Pagination, Loading } from 'musae'
import { Article } from '../../api/article.type'
import { useColumns } from './hooks'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ARTICLES } from '../../api/article'
import { usePagination } from '../../hooks/pagination.hooks'
import { useEvent } from '@aiszlab/relax'

const Articles = () => {
  const navigate = useNavigate()

  const { page, onPageChange, onPageSizeChange, pageSize } = usePagination()
  const {
    loading,
    data: { articles: { items: articles } } = { articles: { items: [], total: 0 } },
    refetch: _refetch
  } = useQuery(GET_ARTICLES, {
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
  }, [])

  return (
    <Loading className='flex flex-col gap-4' loading={loading}>
      <div>
        <Button onClick={toAdd}>新增文章</Button>
      </div>

      <Table<Article> columns={columns} bordered dataSource={articles} />

      <Pagination at={page} pageSize={pageSize} onChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </Loading>
  )
}

export default Articles
