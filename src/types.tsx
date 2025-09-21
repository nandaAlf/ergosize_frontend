import { Dayjs } from "dayjs";

type Classification = "L" | "T" | "E" | "A" | "AD" | "ADM";
type Gender = "F" | "M" | "MF";
export const genderOptions = [
  { value: "F", label: "Femenino" },
  { value: "M", label: "Masculino" },
  { value: "MF", label: "Mixto" },
] as const;
export type DimensionCategory =
  | "Alturas"
  | "Longitudes"
  | "Profundidadesd"
  | "Anchuras"
  | "Diametros"
  | "Circunferencias"
  | "Alcances"
  | "Peso";

export const POPULATION_AGE_RANGES = {
  L: { min: 0, max: 1 },
  T: { min: 1, max: 3 },
  E: { min: 4, max: 10 },
  A: { min: 11, max: 18 },
  AD: { min: 19, max: 59 },
  ADM: { min: 60, max: 120 },
} as const;

export const populationTypes = [
  { value: "L", label: "Lactante" },
  { value: "T", label: "Transicional" },
  { value: "E", label: "Escolar" },
  { value: "A", label: "Adolescente" },
  { value: "AD", label: "Adulto" },
  { value: "ADM", label: "Adulto Mayor" },
] as const;

export interface Dimension {
  id_dimension: number;
  name?: string;
  initial?: string;
  value?: number;
  date?: string;
}
// 3. Mapeo categoría → array de dimensiones
export type GroupedDimensions = {
  category: string;
  id_dimension:number;
  dimensions: Dimension[];
  name: string;
};
export interface StudyBase {
  id?: number;
  name: string;
  classification: Classification | "";
  gender: Gender | "";
  country: string;
  location: string;
  description: string;
  size: number ;
  current_size?: number ;
  age_min: number;
  age_max: number;
  start_date: string | Dayjs | null;
  end_date: string | Dayjs | null;
  supervisor?: number;
 
}

// Lectura (GET):
export interface StudyData extends StudyBase {
  dimensions: GroupedDimensions[];
}

// Escritura (POST/PUT):
export interface StudyPayload extends StudyBase {
  dimensions: Dimension[];
}
export interface PersonMeasurement {
  dimensions: Dimension[]; // Lista de todas las dimensiones
  persons: Person[]; // Lista de personas con sus mediciones
}

export interface Measurement {
  dimension_id: number;
  value: number | null;
  position: "P" | "S";
  date: string;
}

export interface Person {
  id?: number;
  identification: string;
  name: string;
  gender: string;
  date_of_birth: string;
  country: string;
  state: string;
  province: string;
  dimensions?: GroupedDimensions[]; //` Updated to match the structure used in PersonForm
  // dimensions?: Measurement[]; //` Updated to match the structure used in PersonForm
  // measurements?:GroupedDimensions[]
  measurements?: Measurement[];
}

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export interface MetaType {
  graphic: string[];
  coords: { xPct: number; yPct: number };
}

export interface SelectedDim {
  id: number;
  name: string;
  category: string;
  graphic: string;
  coords: { xPct: number; yPct: number };
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

