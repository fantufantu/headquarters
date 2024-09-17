import { Table } from 'musae'
import { useMemo } from 'react'
import type { Article } from '../../api/article.type'

/**
 * @description
 * table columns
 */
export const useColumns = () => {
  return useMemo<Parameters<typeof Table<Article>>[0]['columns']>(() => {
    return [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id'
      }
    ]
  }, [])
}
