import { ACTIONS } from "@/constants/authorization";
import { Select } from "musae";
import { useMemo } from "react";
import type { ActionCode } from "@/constants/enums";

const ActionSelect = ({
  value,
  onChange,
}: {
  value?: ActionCode;
  onChange?: (value: ActionCode | undefined) => void;
}) => {
  const options = useMemo(() => ACTIONS.values().toArray(), []);

  return <Select<ActionCode> value={value} onChange={onChange} options={options} />;
};

export default ActionSelect;
