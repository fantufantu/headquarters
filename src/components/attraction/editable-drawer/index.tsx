import { Drawer, Form } from "musae";
import { useBoolean, useEvent } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { CREATE_ATTRACTION, ATTRACTION, UPDATE_ATTRACTION } from "../../../api/attraction.api";
import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import CitySelect, { type CityValue } from "@/components/inputs/city-select";
import AttractionSelect from "@/components/inputs/attraction-select";

interface FormValue {
  attraction: CityValue;
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
  const city = Form.useWatch("city", form);
  const skipClearRef = useRef(false);

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

        skipClearRef.current = true;
        form.setFieldsValue({
          attraction: { code: _attraction.code, name: _attraction.name },
          city: { code: _attraction.cityCode, name: _attraction.cityCode },
        });
      },
    };
  });

  const handleFormChange = useEvent((_values: Partial<FormValue>, names: (keyof FormValue)[]) => {
    if (!names.includes("city")) return;
    if (skipClearRef.current) {
      skipClearRef.current = false;
      return;
    }
    form.setFieldsValue({ attraction: undefined as unknown as CityValue });
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const { attraction, city: _city } = form.getFieldsValue();
    const cityCode = _city?.code ?? "";
    const isSucceed = code
      ? (await update({ variables: { code, input: { name: attraction!.name, cityCode } } })).data
          ?.updateAttraction
      : (
          await create({
            variables: {
              input: { code: attraction!.code, name: attraction!.name, cityCode },
            },
          })
        ).data?.createAttraction;

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
      <Form form={form} onChange={handleFormChange}>
        <Form.Item name="city" label="城市" required>
          <CitySelect source="api" />
        </Form.Item>

        <Form.Item name="attraction" label="景点" required>
          <AttractionSelect disabled={!!code || !city?.code} cityCode={city?.code} />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default EditableDrawer;
