import { Table } from 'musae'
import { useMemo } from 'react'
import type { Article } from '../../api/article.type'
import { Link } from '@aiszlab/bee/router'
import type { Column } from 'musae/types/table'

/**
 * @description
 * table columns
 */
export const useColumns = () => {
  return useMemo<Column<Article>[]>(() => {
    return [
      {
        valueAt: 'id',
        title: 'ID'
      },
      {
        valueAt: 'title',
        title: '标题'
      },
      {
        key: 'opeartions',
        title: '操作',
        render: (_, { id }) => {
          return <Link to={`/articles/edit/${id}`}>编辑</Link>
        }
      }
    ]
  }, [])
}
