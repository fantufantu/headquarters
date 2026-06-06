import { Drawer, Form, Upload } from "musae";
import { useBoolean, useEvent } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { CREATE_CITY, CITY, UPDATE_CITY } from "../../../api/city.api";
import { forwardRef, useImperativeHandle, useState } from "react";
import CitySelect, { type CityValue } from "@/components/inputs/city-select";
import { upload } from "@/utils/upload";
import { FileItem } from "musae/types/upload";

interface FormValue {
  city: CityValue;
  image: FileItem[];
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
  const [refetchCity] = useLazyQuery(CITY);
  const [create] = useMutation(CREATE_CITY);
  const [update] = useMutation(UPDATE_CITY);

  const [code, setCode] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      open: async (_code) => {
        form.reset();
        turnOn();
        setCode(_code);

        if (!_code) return;
        const _city = (await refetchCity({ variables: { code: _code } }).catch(() => null))?.data
          ?.city;
        if (!_city) return;

        form.setFieldsValue({
          city: { code: _city.code, name: _city.name },
          image: [
            {
              status: "success",
              url: _city.image,
            },
          ],
        });
      },
    };
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const { city, image: _image } = form.getFieldsValue();
    const image = _image?.[0]?.url ?? "";
    const isSucceed = code
      ? (await update({ variables: { code, input: { name: city!.name, image } } })).data?.updateCity
      : (
          await create({
            variables: { input: { code: city!.code, name: city!.name, image: image! } },
          })
        ).data?.createCity;

    if (!isSucceed) return;
    turnOff();
    await onSubmitted?.();
  });

  const uploadImage = useEvent(async (file: File) => {
    return await upload({
      body: file,
      bucketName: "cabin_cab",
      dir: "cities",
    }).catch((error) => {
      console.error(error);
      return "";
    });
  });

  return (
    <Drawer
      open={isOpen}
      onClose={turnOff}
      title={code ? "编辑城市" : "新增城市"}
      onConfirm={submit}
    >
      <Form form={form}>
        <Form.Item name="city" label="城市">
          <CitySelect />
        </Form.Item>

        <Form.Item name="image" label="图片" required>
          <Upload uploader={uploadImage} />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default EditableDrawer;
