import { gql, TypedDocumentNode } from "@apollo/client";
import type {
  District,
  CreateDistrictInput,
  FilterDistrictsInput,
  UpdateDistrictInput,
} from "./district.types";
import type { Pagination, Paginated } from "./pagination.types";

/**
 * @description
 * 查询行政区列表
 */
export const DISTRICTS: TypedDocumentNode<
  { districts: Paginated<District> },
  {
    filter?: FilterDistrictsInput;
    pagination?: Pagination;
  }
> = gql`
  query Districts($filter: FilterDistrictsInput, $pagination: Pagination) {
    districts(filter: $filter, pagination: $pagination) {
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
 * 根据code查询行政区详情
 */
export const DISTRICT: TypedDocumentNode<
  { district: District },
  {
    code: string;
  }
> = gql`
  query District($code: String!) {
    district(code: $code) {
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
 * 创建行政区
 */
export const CREATE_DISTRICT: TypedDocumentNode<
  { createDistrict: boolean },
  {
    input: CreateDistrictInput;
  }
> = gql`
  mutation CreateDistrict($input: CreateDistrictInput!) {
    createDistrict(input: $input)
  }
`;

/**
 * @description
 * 更新行政区
 */
export const UPDATE_DISTRICT: TypedDocumentNode<
  { updateDistrict: boolean },
  {
    code: string;
    input: UpdateDistrictInput;
  }
> = gql`
  mutation UpdateDistrict($code: String!, $input: UpdateDistrictInput!) {
    updateDistrict(code: $code, input: $input)
  }
`;

/**
 * @description 删除行政区
 */
export const DELETE_DISTRICT: TypedDocumentNode<
  { deleteDistrict: boolean },
  { code: string }
> = gql`
  mutation DeleteDistrict($code: String!) {
    deleteDistrict(code: $code)
  }
`;
