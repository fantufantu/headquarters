import { useQuery } from '@apollo/client'
import { usePagination } from './pagination.hooks'
import { RESUME_TEMPLATES } from '../api/resume-template'
import { useEvent } from '@aiszlab/relax'

/**
 * @description
 * 分类列表的查询逻辑
 * 1. 通用的分页逻辑
 */
export const useResumeTemplates = () => {
  const { page, limit, changePage, changeLimit } = usePagination()

  const {
    data: { resumeTemplates: { items: resumeTemplates = [], total = 0 } = {} } = {},
    refetch: _refetch,
    loading
  } = useQuery(RESUME_TEMPLATES, {
    variables: {
      paginateBy: {
        limit,
        page
      }
    }
  })

  const refetch = useEvent(async (_page: number = page) => {
    changePage(_page)

    await _refetch({
      paginateBy: {
        limit,
        page: _page
      }
    })
  })

  return {
    resumeTemplates,
    page,
    limit,
    changePage,
    changeLimit,
    isLoading: loading,
    total,
    refetch
  }
}
