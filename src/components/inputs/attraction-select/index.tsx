import { Select } from "musae";
import { useDebounceCallback, useEvent } from "@aiszlab/relax";
import { useState } from "react";
import { queryTouristAttractions } from "@/api/amap.api";
import { SelectProps, SelectComplexValue } from "musae/types/select";
import type { CityValue } from "@/components/inputs/city-select";

export type { CityValue };

interface Props {
  value?: CityValue;
  onChange?: (value?: CityValue) => void;
  disabled?: boolean;
  cityCode?: string;
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

  const handleChange = useEvent((val?: SelectComplexValue) => {
    onChange?.(val && { code: val.value.toString(), name: val.label?.toString() ?? "" });
  });

  return (
    <Select<SelectComplexValue>
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
      onSearch={searchAttraction}
      onFilter={false}
      options={options}
    />
  );
};

export default AttractionSelect;
