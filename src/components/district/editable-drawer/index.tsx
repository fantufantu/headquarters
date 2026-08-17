import { SideSheet, Form, Upload } from "musae";
import { useBoolean, useEvent } from "@aiszlab/relax";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { CREATE_DISTRICT, DISTRICT, UPDATE_DISTRICT } from "../../../api/district.api";
import { forwardRef, useImperativeHandle, useState } from "react";
import DistrictSelect, { type DistrictValue } from "@/components/inputs/district-select";
import { upload } from "@/utils/upload";
import { BUCKET_NAME } from "@/api/cloud.types";
import { FileItem } from "musae/types/upload";

interface FormValue {
  district: DistrictValue;
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
  const [refetchDistrict] = useLazyQuery(DISTRICT);
  const [create] = useMutation(CREATE_DISTRICT);
  const [update] = useMutation(UPDATE_DISTRICT);

  const [code, setCode] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      open: async (_code) => {
        form.reset();
        turnOn();
        setCode(_code);

        if (!_code) return;
        const _district = (await refetchDistrict({ variables: { code: _code } }).catch(() => null))
          ?.data?.district;
        if (!_district) return;

        form.setFieldsValue({
          district: { code: _district.code, name: _district.name },
          image: [
            {
              status: "success",
              url: _district.image,
            },
          ],
        });
      },
    };
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const { district, image: _image } = form.getFieldsValue();
    const image = _image?.[0]?.url ?? "";
    const isSucceed = code
      ? (await update({ variables: { code, input: { name: district!.name, image } } })).data
          ?.updateDistrict
      : (
          await create({
            variables: { input: { code: district!.code, name: district!.name, image: image! } },
          })
        ).data?.createDistrict;

    if (!isSucceed) return;
    turnOff();
    await onSubmitted?.();
  });

  const uploadImage = useEvent(async (file: File) => {
    return await upload({
      body: file,
      bucketName: BUCKET_NAME.FANTU,
      dir: "districts",
    }).catch((error) => {
      console.error(error);
      return "";
    });
  });

  return (
    <SideSheet
      open={isOpen}
      onClose={turnOff}
      title={code ? "编辑行政区" : "新增行政区"}
      onConfirm={submit}
    >
      <Form form={form}>
        <Form.Item name="district" label="行政区">
          <DistrictSelect />
        </Form.Item>

        <Form.Item name="image" label="图片" required>
          <Upload uploader={uploadImage} />
        </Form.Item>
      </Form>
    </SideSheet>
  );
});

export default EditableDrawer;
