import { gql, TypedDocumentNode } from "@apollo/client";
import type {
  Article,
  ArticleContribution,
  FilterArticleContributionsInput,
  CreateArticleInput,
  UpdateArticleBy,
} from "./article.types";
import type { Pagination, Paginated } from "./pagination.types";

export const ARTICLES: TypedDocumentNode<
  { articles: Paginated<Article> },
  {
    pagination?: Pagination;
  }
> = gql`
  query Articles($pagination: Pagination) {
    articles(filter: {}, pagination: $pagination) {
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
`;

/**
 * @description
 * 创建文章
 */
export const CREATE_ARTICLE: TypedDocumentNode<
  {
    createArticle: Article;
  },
  {
    input: CreateArticleInput;
  }
> = gql`
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
      title
      content
      cover
    }
  }
`;

/**
 * @description
 * 根据id查询文章
 */
export const ARTICLE: TypedDocumentNode<
  {
    article: Article;
  },
  {
    id: number;
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
`;

/**
 * @description
 * 根据id更新文章
 */
export const UPDATE_ARTICLE: TypedDocumentNode<
  {
    updateArticle: Article;
  },
  {
    id: number;
    input: UpdateArticleBy;
  }
> = gql`
  mutation UpdateArticle($id: Int!, $input: UpdateArticleBy!) {
    updateArticle(id: $id, input: $input)
  }
`;

/**
 * @description
 * 根据id删除文章
 */
export const REMOVE_ARTICLE: TypedDocumentNode<
  {
    removeArticle: boolean;
  },
  {
    id: number;
  }
> = gql`
  mutation RemoveArticle($id: Int!) {
    removeArticle(id: $id)
  }
`;

/**
 * @description
 * 查询自己的贡献数
 */
export const ARTICLE_CONTRIBUTIONS: TypedDocumentNode<
  {
    articleContributions: ArticleContribution[];
  },
  {
    filter: FilterArticleContributionsInput;
  }
> = gql`
  query ArticleContributions($filter: FilterArticleContributionsInput!) {
    articleContributions(filter: $filter) {
      contributedAt
      count
    }
  }
`;
