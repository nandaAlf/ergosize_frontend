import { cubaISO, germanyISO, japanISO } from "./ISO_2008";

export interface AnthropometricStudy {
  id: string;
  name: string;
  country: string;
  continent: string;
  year: number;
  sampleSize: number;
  description: string;
  image?: string;
  // ... otros metadatos
}

export const STUDIES_BY_CONTINENT = {
  europe: {
    name: "Europa",
    studies: [germanyISO]
  },
  america: {
    name: "América",
    studies: [cubaISO]
  },
  asia: {
    name: "Asia",
    studies: [japanISO]
  }
  // ... otros continentes
};

export type ContinentKey = keyof typeof STUDIES_BY_CONTINENT;