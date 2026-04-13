import { LMH_ProgramCountries } from "@/types";

export function parseCountryNameForApi(countryName: LMH_ProgramCountries) {
  const country = String(countryName);
  return country.toLowerCase().replace(/\s+/g, "_");
}
