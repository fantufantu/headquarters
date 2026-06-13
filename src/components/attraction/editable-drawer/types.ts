import { CityValue } from "@/components/inputs/city-select";
import { AttractionValue } from "@/components/inputs/attraction-select";
import { FileItem } from "musae/types/upload";

export interface FormValue {
  attraction: AttractionValue;
  city: CityValue;
  image: FileItem[];
}
