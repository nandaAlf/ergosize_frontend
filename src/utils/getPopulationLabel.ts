import { populationTypes } from "../types";

export const getPopulationLabel = (value: string) => {
  const type = populationTypes.find(item => item.value === value);
  return type?.label || "No definido";
};
