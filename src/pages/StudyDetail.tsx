import { useLocation } from "react-router-dom";
import EnhancedTable from "../components/DataTable/dataTable";
import { studyDataProps } from "../types";
import MyTable from "../components/DataTable/MyTable";
import MyTable2 from "../components/DataTable/MyTable2";
import { getData } from "../api/api";
import React, { useEffect, useState } from "react";

// Definir la interfaz para los datos de las dimensiones
interface DimensionData {
  [key: string]: number | string | null; // Las dimensiones pueden ser números, cadenas o nulas
}
// Definir la interfaz para los datos de una persona
interface Person {
  id: number;
  name: string;
  dimensions: DimensionData;
}
// Definir el tipo para una dimensión
interface Dimension {
  id: number;
  name: string;
  initial: string;
}

// Definir la interfaz para la respuesta de la API
interface ApiResponse {
  dimensions: string[]; // Lista de todas las dimensiones
  persons: Person[]; // Lista de personas con sus mediciones
}


// Definir el tipo para la lista de dimensiones
type Dimensions = Dimension[];

const StudyDetail: React.FC = () => {
  const [rows, setRows] = useState<Person[]>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);

  const location = useLocation();
  const study = location.state as studyDataProps; // Obtener los datos del estudio

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData(`/study-data/${study.id}`);
      console.log(response)
      const data = response as ApiResponse;
      setDimensions(data.dimensions);
     
      setRows(data.persons);
     
    };
  
    fetchData();
  }, []);

   // Verificar el estado actualizado
  //  useEffect(() => {
  //   console.log("Dimensiones actualizadas:", dimensions);
  //   console.log("Filas actualizadas:", rows);
  // }, [dimensions, rows]); // Este efecto se ejecutará cuando dimensions o rows cambien


  if (!study) {
    return <div>Estudio no encontrado</div>;
  }

  return (
    <>
      heyyy
      <h1>{study.name}</h1>
      <p>{study.description}</p>
      <p>
        <strong>Región:</strong> {study.location}
      </p>
      <p>
        <strong>País:</strong> {study.country}
      </p>
      {/* <EnhancedTable></EnhancedTable> */}
      <MyTable2 dim={dimensions} persons={rows}></MyTable2>
    </>
  );
};

export default StudyDetail;
