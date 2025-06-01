import { Dayjs } from "dayjs";

// types.ts (o donde tengas tus tipos)
type Classification = "L" | "T" | "E" | "A" | "AD" | "ADM";
type Gender = "F" | "M" | "MF";
export type DimensionCategory =
  | "Alturas"
  | "Longitudes"
  | "Profundidadesd"
  | "Anchuras"
  | "Diametros"
  | "Circunferencias"
  | "Alcances"
  | "Peso";

export interface Dimension {
  id_dimension: number;
  name?: string;
  initial?: string;
  value?: number;
  date?: string;
}
// 3. Mapeo categoría → array de dimensiones
export type GroupedDimensions = {
  // [K in DimensionCategory]?: Dimension[];
  category: string;
  dimensions: Dimension[];
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
 
  // dimensions: Dimension[];
  // dimensions: GroupedDimensions;
}

// Lectura (GET):
export interface StudyData extends StudyBase {
  // dimensions: GroupedDimensions;
  //  dimensions: Dimension[];
  dimensions: GroupedDimensions[];
}

// Escritura (POST/PUT):
export interface StudyPayload extends StudyBase {
  // dimensions: { id_dimension: number }[];
  //  dimensions: GroupedDimensions;
  dimensions: Dimension[];
}
// export interface Person {
//   id: number;
//   name: string;
//   gender:string;
//   date_of_birth:string;
//   country:string;
//   state:string;
//   province:string;
//   // dimensions: Record<string, number | null>;
// }
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
