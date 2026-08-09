import { gql, TypedDocumentNode } from "@apollo/client";
import type { City, CreateCityInput, FilterCitiesInput, UpdateCityInput } from "./city.types";
import type { Pagination, Paginated } from "./pagination.types";

/**
 * @description
 * 查询城市列表
 */
export const CITIES: TypedDocumentNode<
  { cities: Paginated<City> },
  {
    filter?: FilterCitiesInput;
    pagination?: Pagination;
  }
> = gql`
  query Cities($filter: FilterCitiesInput, $pagination: Pagination) {
    cities(filter: $filter, pagination: $pagination) {
      items {
        code
        name
        level
        parentCode
        attractionCount
      }
      total
    }
  }
`;

/**
 * @description
 * 根据code查询城市详情
 */
export const CITY: TypedDocumentNode<
  { city: City },
  {
    code: string;
  }
> = gql`
  query City($code: String!) {
    city(code: $code) {
      code
      name
      level
      parentCode
      image
    }
  }
`;

/**
 * @description
 * 创建城市
 */
export const CREATE_CITY: TypedDocumentNode<
  { createCity: boolean },
  {
    input: CreateCityInput;
  }
> = gql`
  mutation CreateCity($input: CreateCityInput!) {
    createCity(input: $input)
  }
`;

/**
 * @description
 * 更新城市
 */
export const UPDATE_CITY: TypedDocumentNode<
  { updateCity: boolean },
  {
    code: string;
    input: UpdateCityInput;
  }
> = gql`
  mutation UpdateCity($code: String!, $input: UpdateCityInput!) {
    updateCity(code: $code, input: $input)
  }
`;

/**
 * @description 删除城市
 */
export const DELETE_CITY: TypedDocumentNode<
  { deleteCity: boolean },
  { code: string }
> = gql`
  mutation DeleteCity($code: String!) {
    deleteCity(code: $code)
  }
`;
