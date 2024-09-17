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
