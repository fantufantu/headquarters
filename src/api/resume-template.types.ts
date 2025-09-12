export interface ResumeTemplate {
  code: string;
  name: string;
  cover: string;
  tags: string[];
  description: string;
}

export interface CreateResumeTemplateInput extends ResumeTemplate {}

export interface UpdateResumeTemplateInput extends Omit<CreateResumeTemplateInput, "code"> {}
