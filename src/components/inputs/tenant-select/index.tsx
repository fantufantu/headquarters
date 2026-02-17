import { TENANTS } from "@/constants/app-config";
import { Select } from "musae";
import { useMemo } from "react";

const TenantSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
}) => {
  const options = useMemo(() => TENANTS.values().toArray(), []);

  return <Select<string> value={value} onChange={onChange} options={options} />;
};

export default TenantSelect;
