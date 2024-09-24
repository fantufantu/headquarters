import { useMemo } from 'react'
import type { Article } from '../../api/article.type'
import type { Column } from 'musae/types/table'
import Link from '../../components/Link'
import { Space, Popconfirm } from 'musae'

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
          return (
            <Space>
              <Link to={`/articles/edit/${id}`}>编辑</Link>
              <Popconfirm title='确定删除吗？' content='删除后不可恢复'>
                <span>删除</span>
              </Popconfirm>
            </Space>
          )
        }
      }
    ]
  }, [])
}
