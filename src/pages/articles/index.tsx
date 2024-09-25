import { Table, Button, Pagination, Loading } from 'musae'
import { Article } from '../../api/article.type'
import { useColumns } from './hooks'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ARTICLES, REMOVE_ARTICLE } from '../../api/article'
import { usePagination } from '../../hooks/pagination.hooks'

const Articles = () => {
  const navigate = useNavigate()

  const { page, onPageChange, onPageSizeChange, pageSize } = usePagination()
  const { loading, data: { articles: { items: articles } } = { articles: { items: [], total: 0 } } } = useQuery(
    GET_ARTICLES,
    {
      variables: {
        paginateBy: {
          page,
          limit: pageSize
        }
      }
    }
  )

  const columns = useColumns({
    onPageChange
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
