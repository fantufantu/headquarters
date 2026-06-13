import { Form } from "musae";
import AttractionSelect from "../inputs/attraction-select";
import { FormValue } from "../attraction/editable-drawer/types";

interface Props {
  disabled?: boolean;
}

function AttractionField({ disabled: _disabled = false }: Props) {
  const city = Form.useWatch<FormValue, "city">("city");
  const isDisabled = _disabled || !city?.code;

  return (
    <Form.Item name="attraction" label="景点" required>
      <AttractionSelect disabled={isDisabled} cityCode={city?.code} />
    </Form.Item>
  );
}

export default AttractionField;
