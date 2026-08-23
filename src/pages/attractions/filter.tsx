import { Form, Input } from "musae";
import { forwardRef, useImperativeHandle } from "react";
import DistrictSelect, { type DistrictValue } from "@/components/inputs/district-select";

export interface FilterValues {
  keyword?: string;
  districtCode?: string;
}

export interface FilterRef {
  getValues: () => FilterValues;
}

interface Props {
  onChange?: () => void;
}

const AttractionFilter = forwardRef<FilterRef, Props>(({ onChange }, ref) => {
  const form = Form.useForm<{ keyword: string; district: DistrictValue | undefined }>();

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const keyword = form.getFieldValue<string>("keyword");
      const district = form.getFieldValue<DistrictValue>("district");
      return { keyword, districtCode: district?.code };
    },
  }));

  return (
    <Form form={form} onChange={onChange}>
      <Form.Item name="keyword" label="关键词">
        <Input placeholder="请输入关键词" />
      </Form.Item>
      <Form.Item name="district" label="行政区">
        <DistrictSelect />
      </Form.Item>
    </Form>
  );
});

export default AttractionFilter;
