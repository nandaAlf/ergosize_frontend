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



// export interface StudyDimension {
//   id_dimension: number;
//   name?: string;
//   initial?: string;
// }

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





export interface InformacionTarjeta {
    id: any;
    nombre: string;
    sexo: string;
    tipoPoblacion: string;
    rangoEdad: string;
    region: string;
    pais: string;
    muestra: number;
    dimensiones: string[];
    fechaInicio: string;
    fechaFin: string;
  }

  // export interface studyDataProps {
  //   id: number;
  //   name: string;
  //   description: string;
  //   location: string;
  //   country: string;
  //   start_date: string;
  //   end_date: string;
  //   // status:boolean;
  //   // size:number;
  //   // gender:string;
  // }
  // export interface Person {
  //   id: number;
  //   name: string;
  //   birthDate: string; // Fecha de nacimiento
  //   country: string; // País
  //   // measurementDate: string; // Fecha de medición
  //   gender: 'M' | 'F'; // Sexo
  //   // measurementPosition: 'P' | 'S'; // Posición de medición
  //   // dimensions: Record<string, number>; // Mediciones (valores numéricos)
  // }
  // export interface DimensionData {
  //   [key: string]: number | string | null; // Las dimensiones pueden ser números, cadenas o nulas
  // }

  // interface Measurement {
  //   dimension_id: number 
  //   value: number | null;
  // }
  
  // export interface Dimension {
  //   id: number;
  //   name: string;
  //   initial: string;
  // }

  export interface Person {
    id: number;
    name: string;
    dimensions: Record<string, number | null>;
  }