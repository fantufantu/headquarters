import { useBoolean } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Dialog, Form, Input } from "musae";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  CREATE_RESUME_TEMPLATE,
  RESUME_TEMPLATE,
  UPDATE_RESUME_TEMPLATE,
} from "../../../api/resume-template";

export interface EditorRef {
  open: (code?: string) => Promise<void>;
}

interface Props {
  onSubmit?: () => void;
}

interface FormValue {
  code: string;
  name: string;
  cover: string;
}

const Editor = forwardRef<EditorRef, Props>(({ onSubmit }, ref) => {
  const [isVisible, { turnOn, turnOff }] = useBoolean(false);
  const form = Form.useForm<FormValue>();
  const [isEdit, { setBoolean: setIsEdit }] = useBoolean(false);
  const [queryResumeTemplate] = useLazyQuery(RESUME_TEMPLATE);
  const [createResumeTemplate] = useMutation(CREATE_RESUME_TEMPLATE);
  const [updateResumeTemplate] = useMutation(UPDATE_RESUME_TEMPLATE);

  useImperativeHandle(ref, () => {
    return {
      open: async (_code) => {
        form.clear();

        if (_code) {
          const _resumeTemplate = (
            await queryResumeTemplate({ variables: { code: _code } }).catch(() => null)
          )?.data?.resumeTemplate;
          if (!_resumeTemplate) return;

          form.setFieldsValue({
            code: _resumeTemplate.code,
            name: _resumeTemplate.name,
            cover: _resumeTemplate.cover,
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

    const { code, ..._values } = form.getFieldsValue() as FormValue;
    const isSucceed = await (isEdit
      ? updateResumeTemplate({ variables: { code, input: _values } })
      : createResumeTemplate({
          variables: {
            input: {
              code,
              ..._values,
            },
          },
        }).then((_created) => !!_created.data?.createResumeTemplate)
    ).catch(() => false);

    if (!isSucceed) return;
    turnOff();
    onSubmit?.();
  };

  return (
    <Dialog title="编辑" open={isVisible} onClose={turnOff} onConfirm={submit}>
      <Form form={form}>
        <Form.Item label="模板 code" name="code" required>
          <Input placeholder="请输入模板 code" disabled={isEdit} />
        </Form.Item>

        <Form.Item label="模板名称" name="name" required>
          <Input placeholder="请输入模板名称" />
        </Form.Item>

        <Form.Item label="模板封面" name="cover" required>
          <Input placeholder="请输入模板封面" />
        </Form.Item>
      </Form>
    </Dialog>
  );
});

export default Editor;
