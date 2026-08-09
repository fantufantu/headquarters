import { Select } from "musae";
import { useDebounceCallback, useEvent } from "@aiszlab/relax";
import { useState } from "react";
import { queryDistricts } from "@/api/amap.api";
import { useLazyQuery } from "@apollo/client/react";
import { DISTRICTS } from "@/api/district.api";
import { SelectProps } from "musae/types/select";

export interface DistrictValue {
  code: string;
  name: string;
}

interface Props {
  value?: DistrictValue;
  onChange?: (value?: DistrictValue) => void;
  source?: "amap" | "api";
  disabled?: boolean;
}

interface _SelectValue {
  value: string;
  label: string;
}

const DistrictSelect = ({ value, onChange, source = "api", disabled }: Props) => {
  const [options, setOptions] = useState<NonNullable<SelectProps["options"]>>([]);
  const [fetchDistricts] = useLazyQuery(DISTRICTS);

  const { next: searchDistrict } = useDebounceCallback(async (keywords: string) => {
    if (!keywords) {
      setOptions([]);
      return;
    }

    if (source === "api") {
      const districts = (
        await fetchDistricts({
          variables: { filter: { keyword: keywords }, pagination: { page: 1, limit: 20 } },
        }).catch(() => null)
      )?.data?.districts?.items;

      setOptions((districts ?? []).map(({ code, name }) => ({ value: code, label: name })));
      return;
    }

    const districts = (await queryDistricts({ keywords }).catch(() => null))
      ?.values()
      .filter((district) => district.level === "province" || district.level === "city")
      .map(({ adcode, name }) => ({ value: adcode, label: name }))
      .toArray();

    setOptions(districts ?? []);
  }, 500);

  const handleChange = useEvent((val: _SelectValue | undefined) => {
    if (!val) {
      onChange?.(undefined);
      return;
    }
    onChange?.({ code: val.value, name: val.label });
  });

  return (
    <Select<_SelectValue>
      complex
      searchable
      disabled={disabled}
      value={
        value && {
          value: value.code,
          label: value.name,
        }
      }
      onChange={handleChange}
      onSearch={searchDistrict}
      options={options}
      placeholder="请搜索编码或名称"
    />
  );
};

export default DistrictSelect;
