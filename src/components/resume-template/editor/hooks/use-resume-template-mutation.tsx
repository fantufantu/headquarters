import { useMutation } from "@apollo/client/react";
import { CREATE_RESUME_TEMPLATE, UPDATE_RESUME_TEMPLATE } from "../../../../api/resume-template";
import { useMessage } from "musae";

export interface FormValue {
  code: string;
  name: string;
  cover: string;
  tags: string[];
  description: string;
}

export const useResumeTemplateMutation = () => {
  const [createResumeTemplate] = useMutation(CREATE_RESUME_TEMPLATE);
  const [updateResumeTemplate] = useMutation(UPDATE_RESUME_TEMPLATE);
  const [messager] = useMessage();

  const saveResumeTemplate = async (_formValues: Partial<FormValue>, isEdit: boolean) => {
    const { code, name = "", cover = "", tags = [], description = "" } = _formValues;

    if (!code) {
      messager.error({ description: "请填写简历模板代码" });
      return;
    }

    if (isEdit) {
      const { data } = await updateResumeTemplate({
        variables: {
          code,
          input: {
            name,
            cover,
            description,
            tags,
          },
        },
      });

      if (!data?.updateResumeTemplate) {
        messager.error({ description: "更新简历模板失败" });
        return;
      }
    }

    const { data } = await createResumeTemplate({
      variables: {
        input: {
          code,
          cover,
          name,
          description,
          tags,
        },
      },
    });

    if (!data?.createResumeTemplate) {
      messager.error({ description: "创建简历模板失败" });
      return;
    }

    messager.success({ description: "保存成功" });
  };

  return {
    saveResumeTemplate,
  };
};
