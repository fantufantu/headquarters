import { RESOURCES } from "@/constants/authorization";
import { Select } from "musae";
import { useMemo } from "react";
import type { ResourceCode } from "@/api/enums.types";

const ResourceSelect = ({
  value,
  onChange,
}: {
  value?: ResourceCode;
  onChange?: (value: ResourceCode | undefined) => void;
}) => {
  const options = useMemo(() => RESOURCES.values().toArray(), []);

  return <Select<ResourceCode> value={value} onChange={onChange} options={options} />;
};

export default ResourceSelect;
