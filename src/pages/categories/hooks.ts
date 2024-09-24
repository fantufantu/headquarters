import { Column } from 'musae/types/table'
import { useMemo } from 'react'
import { Category } from '../../api/category.type'

export const useColumns = () => {
  return useMemo<Column<Category>[]>(() => {
    return [
      {
        valueAt: 'code',
        title: 'Code'
      },
      {
        valueAt: 'name',
        title: '名称'
      }
    ]
  }, [])
}
