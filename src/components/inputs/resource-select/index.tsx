import { RESOURCES } from "@/constants/authorization";
import { Select } from "musae";
import { useMemo } from "react";

const ResourceSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
}) => {
  const options = useMemo(() => RESOURCES.values().toArray(), []);

  return <Select<string> value={value} onChange={onChange} options={options} />;
};

export default ResourceSelect;
