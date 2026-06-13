import { Form } from "musae";
import { forwardRef, useImperativeHandle } from "react";
import { useEvent } from "@aiszlab/relax";
import CitySelect, { type CityValue } from "@/components/inputs/city-select";

export interface FilterValues {
  cityCode?: string;
}

export interface FilterRef {
  getValues: () => FilterValues;
}

interface Props {
  onChange?: (values: FilterValues) => void;
}

const AttractionFilter = forwardRef<FilterRef, Props>(({ onChange }, ref) => {
  const form = Form.useForm<{ city: CityValue | undefined }>();

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const city = form.getFieldValue("city");
      return { cityCode: city?.code };
    },
  }));

  const handleChange = useEvent(() => {
    const city = form.getFieldValue("city");
    onChange?.({ cityCode: city?.code });
  });

  return (
    <Form form={form} onChange={handleChange}>
      <Form.Item name="city" label="城市">
        <CitySelect />
      </Form.Item>
    </Form>
  );
});

export default AttractionFilter;
