export interface ResumeTemplate {
  id: number;
  code: string;
  name: string;
  cover: string;
}

export interface CreateResumeTemplateInput
  extends Pick<ResumeTemplate, "code" | "name" | "cover"> {}

export interface UpdateResumeTemplateInput extends Partial<CreateResumeTemplateInput> {}
