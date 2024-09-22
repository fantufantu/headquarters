import { gql, TypedDocumentNode } from '@apollo/client'
import type { Article, CreateArticleBy, UpdateArticleBy } from './article.type'
import { Paginated } from './pagination.type'

export const GET_ARTICLES: TypedDocumentNode<{ articles: Paginated<Article> }, void> = gql`
  query GetArticles {
    articles(filterBy: {}) {
      items {
        id
        title
        content
        createdBy {
          id
        }
      }
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
export const GET_ARTICLE_BY_ID: TypedDocumentNode<
  {
    article: Article
  },
  {
    id: number
  }
> = gql`
  query GetArticle($id: Int!) {
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
