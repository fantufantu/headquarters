import { Form, Input } from "musae";
import { forwardRef, useImperativeHandle } from "react";
import CitySelect, { type CityValue } from "@/components/inputs/city-select";

export interface FilterValues {
  keyword?: string;
  cityCode?: string;
}

export interface FilterRef {
  getValues: () => FilterValues;
}

interface Props {
  onChange?: () => void;
}

const AttractionFilter = forwardRef<FilterRef, Props>(({ onChange }, ref) => {
  const form = Form.useForm<{ keyword: string; city: CityValue | undefined }>();

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const keyword = form.getFieldValue<string>("keyword");
      const city = form.getFieldValue<CityValue>("city");
      return { keyword, cityCode: city?.code };
    },
  }));

  return (
    <Form form={form} onChange={onChange}>
      <Form.Item name="keyword" label="关键词">
        <Input placeholder="请输入关键词" />
      </Form.Item>
      <Form.Item name="city" label="城市">
        <CitySelect />
      </Form.Item>
    </Form>
  );
});

export default AttractionFilter;
