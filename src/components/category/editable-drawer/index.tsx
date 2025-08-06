import { Drawer, Form, Input, Upload } from "musae";
import { useBoolean, useEvent } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_CATEGORY, CATEGORY, UPDATE_CATEGORY } from "../../../api/category";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Dir, upload } from "../../../utils/upload";
import type { UploadedItem } from "musae/types/upload";

interface FormValue {
  code: string;
  name: string;
  images: UploadedItem[];
}

export interface EditableDrawerRef {
  open: (code?: string) => void;
}

interface Props {
  onSubmitted?: () => void | Promise<void>;
}

const EditableDrawer = forwardRef<EditableDrawerRef, Props>(({ onSubmitted }, ref) => {
  const [isOpen, { turnOff, turnOn }] = useBoolean(false);
  const form = Form.useForm<FormValue>();
  const [refetch] = useLazyQuery(CATEGORY);
  const [create] = useMutation(CREATE_CATEGORY);
  const [update] = useMutation(UPDATE_CATEGORY);
  const [code, setCode] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      open: async (_code) => {
        setCode(_code);
        form.reset();

        if (!_code) {
          turnOn();
          return;
        }

        const _category = (await refetch({ variables: { code: _code } }).catch(() => null))?.data
          ?.articleCategory;
        if (_category) {
          form.setFieldsValue({
            code: _category.code,
            name: _category.name,
            images: [{ url: _category.image, key: _category.image, status: "success" }],
          });
        }

        turnOn();
      },
    };
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const _values = form.getFieldsValue() as FormValue;
    const _editing = {
      code: _values.code,
      name: _values.name,
      image: _values.images
        .map((_) => _.url)
        .filter(Boolean)
        .at(0)!,
    };

    const isSucceed = !!code
      ? update({ variables: { code, input: _editing } })
      : !!(
          await create({
            variables: {
              input: _editing,
            },
          })
        ).data?.createArticleCategory;

    if (!isSucceed) return;
    turnOff();
    await onSubmitted?.();
  });

  const uploader = useCallback((file: File) => {
    return upload(file, Dir.StackLogos);
  }, []);

  return (
    <Drawer open={isOpen} onClose={turnOff} title="编辑分类" onConfirm={submit}>
      <Form form={form}>
        <Form.Item name="code" label="唯一标识" required>
          <Input />
        </Form.Item>

        <Form.Item name="name" label="名称" required>
          <Input />
        </Form.Item>

        <Form.Item name="images" label="logo" required>
          <Upload uploader={uploader} limit={1} renderItem="picture" />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default EditableDrawer;
