import { ACTIONS } from "@/constants/authorization";
import { Select } from "musae";
import { useMemo } from "react";

const ActionSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
}) => {
  const options = useMemo(() => ACTIONS.values().toArray(), []);

  return <Select<string> value={value} onChange={onChange} options={options} />;
};

export default ActionSelect;
