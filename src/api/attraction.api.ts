import { gql, TypedDocumentNode } from "@apollo/client";
import type {
  Attraction,
  CreateAttractionInput,
  FilterAttractionsInput,
  UpdateAttractionInput,
} from "./attraction.types";
import type { Pagination, Paginated } from "./pagination.types";

/**
 * @description
 * 分页查询景点
 */
export const ATTRACTIONS: TypedDocumentNode<
  { attractions: Paginated<Attraction> },
  {
    filter?: FilterAttractionsInput;
    pagination?: Pagination;
  }
> = gql`
  query Attractions($filter: FilterAttractionsInput, $pagination: Pagination) {
    attractions(filter: $filter, pagination: $pagination) {
      items {
        code
        name
        districtCode
        district {
          name
        }
        image
      }
      total
    }
  }
`;

/**
 * @description
 * 根据code查询景点详情
 */
export const ATTRACTION: TypedDocumentNode<
  { attraction: Attraction },
  {
    code: string;
  }
> = gql`
  query Attraction($code: String!) {
    attraction(code: $code) {
      code
      name
      districtCode
      image
      district {
        code
        name
      }
    }
  }
`;

/**
 * @description
 * 创建景点
 */
export const CREATE_ATTRACTION: TypedDocumentNode<
  { createAttraction: boolean },
  {
    input: CreateAttractionInput;
  }
> = gql`
  mutation CreateAttraction($input: CreateAttractionInput!) {
    createAttraction(input: $input)
  }
`;

/**
 * @description
 * 更新景点
 */
export const UPDATE_ATTRACTION: TypedDocumentNode<
  { updateAttraction: boolean },
  {
    code: string;
    input: UpdateAttractionInput;
  }
> = gql`
  mutation UpdateAttraction($code: String!, $input: UpdateAttractionInput!) {
    updateAttraction(code: $code, input: $input)
  }
`;

/**
 * @description
 * 删除景点
 */
export const DELETE_ATTRACTION: TypedDocumentNode<
  { deleteAttraction: boolean },
  {
    code: string;
  }
> = gql`
  mutation DeleteAttraction($code: String!) {
    deleteAttraction(code: $code)
  }
`;
