import { Category } from './category.types'

/**
 * @description
 * article
 */
export interface Article {
  id: number
  createdAt: Date
  updatedAt: Date
  title: string
  content: string
  cover: string
  categories?: Category[]
}

/**
 * @description
 * 创建文章实体
 */
export interface CreateArticleBy {
  title: string
  content: string
  cover?: string
  categoryCodes: string[]
}

/**
 * @description
 * 更新文章实体
 */
export type UpdateArticleBy = Partial<CreateArticleBy>

/**
 * @description
 * 查询贡献数参数
 */
export interface ArticleContributionsBy {
  from: Date
  to: Date
}

/**
 * @description
 * 文章贡献数
 */
export interface ArticleContribution {
  contributedAt: string
  count: number
}
