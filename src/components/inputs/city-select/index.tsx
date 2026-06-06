import { Select } from "musae";
import { useDebounceCallback, useEvent } from "@aiszlab/relax";
import { useState } from "react";
import { queryDistricts } from "@/api/amap.api";
import { SelectProps } from "musae/types/select";

export interface CityValue {
  code: string;
  name: string;
}

interface Props {
  value?: CityValue;
  onChange?: (value?: CityValue) => void;
}

interface _SelectValue {
  value: string;
  label: string;
}

const CitySelect = ({ value, onChange }: Props) => {
  const [options, setOptions] = useState<NonNullable<SelectProps["options"]>>([]);

  const { next: searchCity } = useDebounceCallback(async (keywords: string) => {
    if (!keywords) {
      setOptions([]);
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
      value={
        value
          ? {
              value: value.code,
              label: value.name,
            }
          : void 0
      }
      onChange={handleChange}
      onSearch={searchCity}
      options={options}
    />
  );
};

export default CitySelect;
