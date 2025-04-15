import { useLocation, useParams } from "react-router-dom";
import { Dimension, Person, StudyData } from "../types";
import { getData } from "../api/api";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../components/TableData/Table";
// import { MyTable } from "../components/TableData/Table";

// Definir la interfaz para la respuesta de la API
interface ApiResponse {
  dimensions: Dimension[]; // Lista de todas las dimensiones
  persons: Person[]; // Lista de personas con sus mediciones
}

const StudyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const study = location.state?.study as StudyData | undefined; // Obtener los datos del estudio
  const [persons, setPersons] = useState<Person[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData(`/study-data/${id}`);
      console.log(response);
      const data = response as ApiResponse;
      setDimensions((study?.dimensions as Dimension[]) || []);
      setPersons(data.persons);
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.log("st", study);
    console.log("nm", study?.name);
  }, [study]);

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
      <TableComponent
        dimensions={dimensions}
        persons={persons}
        study_id={study.id || 0}
      ></TableComponent>
    </>
  );
};

export default StudyDetail;
