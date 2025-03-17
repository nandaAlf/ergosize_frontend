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

  export interface studyDataProps {
    id: number;
    name: string;
    description: string;
    location: string;
    country: string;
    start_date: string;
    end_date: string;
    // status:boolean;
    // size:number;
    // gender:string;
  }
  export interface Person {
    id: number;
    name: string;
    birthDate: string; // Fecha de nacimiento
    country: string; // País
    // measurementDate: string; // Fecha de medición
    gender: 'M' | 'F'; // Sexo
    // measurementPosition: 'P' | 'S'; // Posición de medición
    // dimensions: Record<string, number>; // Mediciones (valores numéricos)
  }