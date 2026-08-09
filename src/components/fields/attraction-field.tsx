import { Form } from "musae";
import AttractionSelect from "../inputs/attraction-select";
import { FormValue } from "../attraction/editable-drawer/types";

interface Props {
  disabled?: boolean;
}

function AttractionField({ disabled: _disabled = false }: Props) {
  const district = Form.useWatch<FormValue, "district">("district");
  const isDisabled = _disabled || !district?.code;

  return (
    <Form.Item name="attraction" label="景点" required>
      <AttractionSelect disabled={isDisabled} cityCode={district?.code} />
    </Form.Item>
  );
}

export default AttractionField;
