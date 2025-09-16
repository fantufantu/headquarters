import { useBoolean } from "@aiszlab/relax";
import { useLazyQuery } from "@apollo/client/react";
import { Dialog, Form, Input, Select, Textarea, useMessage } from "musae";
import { forwardRef, useImperativeHandle } from "react";
import { RESUME_TEMPLATE } from "../../../api/resume-template";
import { useResumeTemplateMutation, type FormValue } from "./hooks/use-resume-template-mutation";
import { useResumeTemplateTagOptions } from "./hooks/use-resume-template-tag-options";

export interface EditorRef {
  open: (code?: string) => Promise<void>;
}

interface Props {
  onSubmit?: () => void;
}

const Editor = forwardRef<EditorRef, Props>(({ onSubmit }, ref) => {
  const [isVisible, { turnOn, turnOff }] = useBoolean(false);
  const form = Form.useForm<FormValue>();
  const [isEdit, { setBoolean: setIsEdit }] = useBoolean(false);
  const [queryResumeTemplate] = useLazyQuery(RESUME_TEMPLATE);
  const { saveResumeTemplate } = useResumeTemplateMutation();
  const [messager] = useMessage();
  const tagOptions = useResumeTemplateTagOptions();

  useImperativeHandle(ref, () => {
    return {
      open: async (_code) => {
        form.clear();

        if (_code) {
          const _resumeTemplate = (
            await queryResumeTemplate({ variables: { code: _code } }).catch(() => null)
          )?.data?.resumeTemplate;

          if (!_resumeTemplate) {
            messager.error({
              description: "模板不存在，请重试！",
            });
            return;
          }

          form.setFieldsValue({
            code: _resumeTemplate.code,
            name: _resumeTemplate.name,
            cover: _resumeTemplate.cover,
            description: _resumeTemplate.description,
            tags: _resumeTemplate.tags,
          });
        }

        setIsEdit(!!_code);
        turnOn();
      },
    };
  });

  const submit = async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    await saveResumeTemplate(form.getFieldsValue(), isEdit);

    turnOff();
    onSubmit?.();
  };

  return (
    <Dialog title="编辑" open={isVisible} onClose={turnOff} onConfirm={submit}>
      <Form form={form}>
        <Form.Item label="code" name="code" required>
          <Input placeholder="请输入模板 code" disabled={isEdit} />
        </Form.Item>

        <Form.Item label="模板名称" name="name" required>
          <Input placeholder="请输入模板名称" />
        </Form.Item>

        <Form.Item label="模板封面" name="cover" required>
          <Input placeholder="请输入模板封面" />
        </Form.Item>

        <Form.Item label="模板描述" name="description" required>
          <Textarea placeholder="请输入模板描述" />
        </Form.Item>

        <Form.Item<FormValue> label="模板标签" name="tags">
          <Select placeholder="请选择模板标签" options={tagOptions} mode="multiple" />
        </Form.Item>
      </Form>
    </Dialog>
  );
});

export default Editor;
