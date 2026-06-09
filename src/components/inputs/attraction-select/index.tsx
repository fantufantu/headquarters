import { Select } from "musae";
import { useDebounceCallback, useEvent } from "@aiszlab/relax";
import { useState } from "react";
import { queryTouristAttractions } from "@/api/amap.api";
import { SelectProps } from "musae/types/select";
import type { CityValue } from "@/components/inputs/city-select";

export type { CityValue };

interface Props {
  value?: CityValue;
  onChange?: (value?: CityValue) => void;
  disabled?: boolean;
  cityCode?: string;
}

interface _SelectValue {
  value: string;
  label: string;
}

const AttractionSelect = ({ value, onChange, disabled, cityCode }: Props) => {
  const [options, setOptions] = useState<NonNullable<SelectProps["options"]>>([]);

  const { next: searchAttraction } = useDebounceCallback(async (keywords: string) => {
    if (!keywords) {
      setOptions([]);
      return;
    }

    const pois = (await queryTouristAttractions({ keywords, cityCode }).catch(() => null))?.map(
      ({ id, name }) => ({ value: id, label: name }),
    );

    setOptions(pois ?? []);
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
        value
          ? {
              value: value.code,
              label: value.name,
            }
          : void 0
      }
      onChange={handleChange}
      onSearch={searchAttraction}
      options={options}
    />
  );
};

export default AttractionSelect;
