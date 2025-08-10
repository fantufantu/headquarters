import { gql, TypedDocumentNode } from "@apollo/client";
import {
  CreateResumeTemplateInput,
  ResumeTemplate,
  UpdateResumeTemplateInput,
} from "./resume-template.types";
import { Pagination, Paginated } from "./pagination.types";

/**
 * @description 查询简历模板列表
 */
export const RESUME_TEMPLATES: TypedDocumentNode<
  { resumeTemplates: Paginated<ResumeTemplate> },
  {
    pagination?: Pagination;
  }
> = gql`
  query ResumeTemplates($pagination: Pagination) {
    resumeTemplates(pagination: $pagination) {
      items {
        code
        name
        cover
      }
      total
    }
  }
`;

/**
 * @description 获取简历模板详情
 */
export const RESUME_TEMPLATE: TypedDocumentNode<
  { resumeTemplate: ResumeTemplate },
  { code: string }
> = gql`
  query ResumeTemplate($code: String!) {
    resumeTemplate(code: $code) {
      code
      name
      cover
    }
  }
`;

/**
 * 创建简历模板
 * @description 创建简历模板
 */
export const CREATE_RESUME_TEMPLATE: TypedDocumentNode<
  { createResumeTemplate: ResumeTemplate },
  { input: CreateResumeTemplateInput }
> = gql`
  mutation CreateResumeTemplate($input: CreateResumeTemplateInput!) {
    createResumeTemplate(input: $input) {
      code
      name
      cover
    }
  }
`;

/**
 * 更新简历模板
 * @description 更新简历模板
 */
export const UPDATE_RESUME_TEMPLATE: TypedDocumentNode<
  { updateResumeTemplate: boolean },
  { code: string; input: UpdateResumeTemplateInput }
> = gql`
  mutation UpdateResumeTemplate($code: String!, $input: UpdateResumeTemplateInput!) {
    updateResumeTemplate(code: $code, input: $input)
  }
`;

/**
 * 删除简历模板
 * @description 删除简历模板
 */
export const REMOVE_RESUME_TEMPLATE: TypedDocumentNode<
  { removeResumeTemplate: boolean },
  { code: string }
> = gql`
  mutation RemoveResumeTemplate($code: String!) {
    removeResumeTemplate(code: $code)
  }
`;
