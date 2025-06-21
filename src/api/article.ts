import { gql, TypedDocumentNode } from '@apollo/client'
import type {
  Article,
  ArticleContribution,
  ArticleContributionsBy,
  CreateArticleBy,
  UpdateArticleBy
} from './article.types'
import type { PaginateBy, Paginated } from './pagination.types'

export const ARTICLES: TypedDocumentNode<
  { articles: Paginated<Article> },
  {
    paginateBy?: PaginateBy
  }
> = gql`
  query Articles($paginateBy: PaginateBy) {
    articles(filterBy: {}, paginateBy: $paginateBy) {
      items {
        id
        title
        content
        createdBy {
          id
        }
      }
      total
    }
  }
`

/**
 * @description
 * 创建文章
 */
export const CREATE_ARTICLE: TypedDocumentNode<
  {
    createArticle: Article
  },
  {
    createBy: CreateArticleBy
  }
> = gql`
  mutation CreateArticle($createBy: CreateArticleBy!) {
    createArticle(createBy: $createBy) {
      id
      title
      content
      cover
    }
  }
`

/**
 * @description
 * 根据id查询文章
 */
export const ARTICLE: TypedDocumentNode<
  {
    article: Article
  },
  {
    id: number
  }
> = gql`
  query Article($id: Int!) {
    article(id: $id) {
      title
      content
      categories {
        code
        name
      }
    }
  }
`

/**
 * @description
 * 根据id更新文章
 */
export const UPDATE_ARTICLE: TypedDocumentNode<
  {
    updateArticle: Article
  },
  {
    id: number
    updateBy: UpdateArticleBy
  }
> = gql`
  mutation UpdateArticle($id: Int!, $updateBy: UpdateArticleBy!) {
    updateArticle(id: $id, updateBy: $updateBy)
  }
`

/**
 * @description
 * 根据id删除文章
 */
export const REMOVE_ARTICLE: TypedDocumentNode<
  {
    removeArticle: boolean
  },
  {
    id: number
  }
> = gql`
  mutation RemoveArticle($id: Int!) {
    removeArticle(id: $id)
  }
`

/**
 * @description
 * 查询自己的贡献数
 */
export const ARTICLE_CONTRIBUTIONS: TypedDocumentNode<
  {
    articleContributions: ArticleContribution[]
  },
  {
    queryBy: ArticleContributionsBy
  }
> = gql`
  query ArticleContributions($queryBy: ArticleContributionsBy!) {
    articleContributions(queryBy: $queryBy) {
      contributedAt
      count
    }
  }
`
