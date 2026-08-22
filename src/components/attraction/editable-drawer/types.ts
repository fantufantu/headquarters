import { DistrictValue } from "@/components/inputs/district-select";
import { AttractionValue } from "@/components/inputs/attraction-select";
import { FileItem } from "musae/types/upload";

export interface FormValue {
  attraction: AttractionValue;
  district: DistrictValue;
  image: FileItem[];
}
