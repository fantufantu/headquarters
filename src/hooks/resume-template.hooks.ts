import { useQuery } from '@apollo/client'
import { usePagination } from './pagination.hooks'
import { RESUME_TEMPLATES } from '../api/resume-template'

/**
 * @description
 * 分类列表的查询逻辑
 * 1. 通用的分页逻辑
 */
export const useResumeTemplates = () => {
  const { page, onPageChange, onPageSizeChange, pageSize } = usePagination()

  const {
    data: { resumeTemplates: { items: resumeTemplates = [], total = 0 } = {} } = {},
    refetch,
    loading
  } = useQuery(RESUME_TEMPLATES, {
    variables: {
      paginateBy: {
        limit: pageSize,
        page
      }
    }
  })

  return {
    resumeTemplates,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    isLoading: loading,
    total,
    refetch
  }
}
