import { useTheme } from 'musae'
import type { Column } from 'musae/types/table'
import { useMemo } from 'react'
import { ResumeTemplate } from '../../api/resume-template.types'

/**
 * @description
 * 列配置
 */
export const useColumns = () => {
  const theme = useTheme()

  return useMemo<Column<ResumeTemplate>[]>(() => {
    return [
      {
        valueAt: 'id',
        title: 'ID'
      },
      {
        valueAt: 'name',
        title: '名称'
      }
    ]
  }, [theme])
}
