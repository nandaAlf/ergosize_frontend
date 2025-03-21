import { useLocation } from "react-router-dom";
import { Dimension, Person, studyDataProps } from "../types";
import { getData } from "../api/api";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../components/TableData/Table";
// import { MyTable } from "../components/TableData/Table";

// Definir la interfaz para la respuesta de la API
interface ApiResponse {
  dimensions: Dimension[]; // Lista de todas las dimensiones
  persons: Person[]; // Lista de personas con sus mediciones
}


// // Definir el tipo para la lista de dimensiones
// type Dimensions = Dimension[];

const StudyDetail: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);

  const location = useLocation();
  const study = location.state as studyDataProps; // Obtener los datos del estudio

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData(`/study-data/${study.id}`);
      console.log(response)
      const data = response as ApiResponse;
      setDimensions(data.dimensions);
     
      setPersons(data.persons);
      
    };
  
    fetchData();
  }, []);
  useEffect(() => {
      console.log("Aqui")
      console.log(dimensions)
      // console.log(persons)
  }, [dimensions,persons]);

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
      {/* <MyTable dimensions={dimensions} persons={persons}></MyTable> */}
      {/* <EnhancedTable></EnhancedTable> */}
      {/* <MyTable2 dim={dimensions} persons={persons}></MyTable2> */}
      {/* <MyTable></MyTable> */}
       <TableComponent dimensions={dimensions} persons={persons}></TableComponent>
       {/* <pre>{JSON.stringify(persons)}</pre>
       <pre>{JSON.stringify(dimensions)}</pre> */}
    </>
  );
};

export default StudyDetail;
