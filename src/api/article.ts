import { gql, TypedDocumentNode } from '@apollo/client'
import type { Article, CreateArticleBy } from './article.type'

export const GET_ARTICLES: TypedDocumentNode<{ articles: Article[] }, void> = gql`
  query GetArticles {
    articles(filterBy: {}) {
      items {
        title
        content
        categoryCodes
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
