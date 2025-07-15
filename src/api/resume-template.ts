import { gql, TypedDocumentNode } from '@apollo/client'
import { ResumeTemplate } from './resume-template.types'
import { PaginateBy, Paginated } from './pagination.types'

/**
 * @description 查询简历模板列表
 */
export const RESUME_TEMPLATES: TypedDocumentNode<
  { resumeTemplates: Paginated<ResumeTemplate> },
  {
    paginateBy?: PaginateBy
  }
> = gql`
  query ResumeTemplates($paginateBy: PaginateBy) {
    resumeTemplates(paginateBy: $paginateBy) {
      items {
        id
        name
        cover
      }
      total
    }
  }
`

/**
 * @description 获取简历模板详情
 */
export const RESUME_TEMPLATE: TypedDocumentNode<{ resumeTemplate: ResumeTemplate }, { id: number }> = gql`
  query ResumeTemplate($id: Int!) {
    resumeTemplate(id: $id) {
      id
      name
      cover
    }
  }
`
