export interface ResumeTemplate {
  id: number
  name: string
  cover: string
}

export interface CreateResumeTemplateInput {
  name: string
  cover: string
}

export interface UpdateResumeTemplateInput extends Partial<CreateResumeTemplateInput> {}
