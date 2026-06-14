import { Drawer, Form, Upload } from "musae";
import { useBoolean, useEvent } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { CREATE_ATTRACTION, ATTRACTION, UPDATE_ATTRACTION } from "../../../api/attraction.api";
import { forwardRef, useImperativeHandle, useState } from "react";
import CitySelect from "@/components/inputs/city-select";
import AttractionField from "@/components/fields/attraction-field";
import { upload } from "@/utils/upload";
import { type FormValue } from "./types";

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
          attraction: { code: _attraction.code, name: _attraction.name },
          city: { code: _attraction.city.code, name: _attraction.city.name },
          image: [
            {
              status: "success",
              url: _attraction.image,
            },
          ],
        });
      },
    };
  });

  const handleFormChange = useEvent((_values: Partial<FormValue>, names: (keyof FormValue)[]) => {
    const fieldNames = new Set(names);

    if (fieldNames.has("city")) {
      form.setFieldsValue({
        attraction: void 0,
      });
    }
  });

  const uploadImage = useEvent(async (file: File) => {
    return await upload({
      body: file,
      bucketName: "cabin_cab",
      dir: "attractions",
    }).catch((error) => {
      console.error(error);
      return "";
    });
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const { attraction, city: _city, image: _image } = form.getFieldsValue();
    const cityCode = _city?.code ?? "";
    const image = _image?.[0]?.url ?? "";
    const isSucceed = code
      ? (await update({ variables: { code, input: { image } } }))
          .data?.updateAttraction
      : (
          await create({
            variables: {
              input: { code: attraction!.code, name: attraction!.name, cityCode, image },
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
          <CitySelect source="api" disabled={!!code} />
        </Form.Item>

        <AttractionField disabled={!!code} />

        <Form.Item name="image" label="图片" required>
          <Upload uploader={uploadImage} />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default EditableDrawer;
