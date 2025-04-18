import { Dayjs } from "dayjs";

// types.ts (o donde tengas tus tipos)
type Classification = 'L' | 'T' | 'E' | 'A' | 'AD' | 'ADM';
type Gender = 'F' | 'M' | 'MF';

export interface Dimension {
  id_dimension: number;
  name?: string;
  initial?: string;
  value?:number;
}

export interface StudyData {
  id?: number;
  name: string;
 classification: Classification |'';
  gender: Gender | '';
  country: string;
  location: string;
  description: string;
  size: number | null;
  age_min: number;
  age_max: number;
  start_date: string| Dayjs| null ;
  end_date: string | Dayjs |null ;
  dimensions: Dimension[] ;
}
  export interface Person {
    id: number;
    name: string;
    dimensions: Record<string, number | null>;
  }
  export interface PersonMeasurement {
    dimensions: Dimension[]; // Lista de todas las dimensiones
    persons: Person[]; // Lista de personas con sus mediciones
  }