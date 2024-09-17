import { Table, Button, Pagination } from 'musae'
import { Article } from '../../api/article.type'
import { useColumns } from './hooks'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ARTICLES } from '../../api/article'

const Articles = () => {
  const columns = useColumns()
  const navigate = useNavigate()

  const { loading, error, data } = useQuery(GET_ARTICLES)

  console.log('data====', data)

  const toAdd = useCallback(() => {
    navigate('/articles/add')
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <Button onClick={toAdd}>新增文章</Button>
      </div>

      <Table<Article> columns={columns} bordered />

      <Pagination />
    </div>
  )
}

export default Articles
