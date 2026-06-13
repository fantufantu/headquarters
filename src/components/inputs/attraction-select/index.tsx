import { Select } from "musae";
import { useEvent, useRequest } from "@aiszlab/relax";
import { queryTouristAttractions } from "@/api/amap.api";
import { SelectComplexValue } from "musae/types/select";

export interface AttractionValue {
  code: string;
  name: string;
}

interface Props {
  value?: AttractionValue;
  onChange?: (value?: AttractionValue) => void;
  disabled?: boolean;
  cityCode?: string;
}

const AttractionSelect = ({ value, onChange, disabled, cityCode }: Props) => {
  const { data: options, run: searchAttraction } = useRequest(
    async (keywords?: string) => {
      if (!keywords) return [];
      const pois = (await queryTouristAttractions({ keywords, cityCode }).catch(() => null))?.map(
        ({ id, name }) => ({ value: id, label: name }),
      );
      return pois;
    },
    { debounceWait: 500, deps: [cityCode] },
  );

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
      options={options ?? []}
    />
  );
};

export default AttractionSelect;
