import { gql, TypedDocumentNode } from "@apollo/client";
import {
  CreateResumeTemplateInput,
  ResumeTemplate,
  UpdateResumeTemplateInput,
} from "./resume-template.types";
import { PaginateBy, Paginated } from "./pagination.types";

/**
 * @description 查询简历模板列表
 */
export const RESUME_TEMPLATES: TypedDocumentNode<
  { resumeTemplates: Paginated<ResumeTemplate> },
  {
    paginateBy?: PaginateBy;
  }
> = gql`
  query ResumeTemplates($paginateBy: PaginateBy) {
    resumeTemplates(paginateBy: $paginateBy) {
      items {
        id
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
  { id: number }
> = gql`
  query ResumeTemplate($id: Int!) {
    resumeTemplate(id: $id) {
      id
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
    createResumeTemplate(createResumeTemplateInput: $input) {
      id
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
  { id: number; input: UpdateResumeTemplateInput }
> = gql`
  mutation UpdateResumeTemplate($id: Int!, $input: UpdateResumeTemplateInput!) {
    updateResumeTemplate(id: $id, updateResumeTemplateInput: $input)
  }
`;

/**
 * 删除简历模板
 * @description 删除简历模板
 */
export const REMOVE_RESUME_TEMPLATE: TypedDocumentNode<
  { removeResumeTemplate: boolean },
  { id: number }
> = gql`
  mutation RemoveResumeTemplate($id: Int!) {
    removeResumeTemplate(id: $id)
  }
`;
