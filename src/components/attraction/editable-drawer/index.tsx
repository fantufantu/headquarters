import { Drawer, Form, Input } from "musae";
import { useBoolean, useEvent } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { CREATE_ATTRACTION, ATTRACTION, UPDATE_ATTRACTION } from "../../../api/attraction.api";
import { forwardRef, useImperativeHandle, useState } from "react";
import CitySelect, { type CityValue } from "@/components/inputs/city-select";

interface FormValue {
  code: string;
  name: string;
  city: CityValue;
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
  const [refetchAttraction] = useLazyQuery(ATTRACTION);
  const [create] = useMutation(CREATE_ATTRACTION);
  const [update] = useMutation(UPDATE_ATTRACTION);

  const [code, setCode] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      open: async (_code) => {
        form.reset();
        turnOn();
        setCode(_code);

        if (!_code) return;
        const _attraction = (
          await refetchAttraction({ variables: { code: _code } }).catch(() => null)
        )?.data?.attraction;
        if (!_attraction) return;

        form.setFieldsValue({
          code: _attraction.code,
          name: _attraction.name,
          city: { code: _attraction.cityCode, name: _attraction.cityCode },
        });
      },
    };
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const { code: _code, name, city } = form.getFieldsValue();
    const cityCode = city?.code ?? "";
    const isSucceed = code
      ? (await update({ variables: { code, input: { name: name!, cityCode } } })).data
          ?.updateAttraction
      : (await create({ variables: { input: { code: _code!, name: name!, cityCode } } })).data
          ?.createAttraction;

    if (!isSucceed) return;
    turnOff();
    await onSubmitted?.();
  });

  return (
    <Drawer
      open={isOpen}
      onClose={turnOff}
      title={code ? "编辑景点" : "新增景点"}
      onConfirm={submit}
    >
      <Form form={form}>
        <Form.Item name="code" label="景点编码" required>
          <Input disabled={!!code} />
        </Form.Item>

        <Form.Item name="name" label="景点名称" required>
          <Input />
        </Form.Item>

        <Form.Item name="city" label="城市" required>
          <CitySelect />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default EditableDrawer;
