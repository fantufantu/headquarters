import { Option } from "musae/types/option";
import { useMemo } from "react";

export const useResumeTemplateTagOptions = () => {
  return useMemo<Option[]>(() => {
    return [
      {
        value: "研发",
      },
    ];
  }, []);
};
