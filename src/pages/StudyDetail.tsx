import { useLocation, useParams } from "react-router-dom";
import { Dimension, Person, StudyData } from "../types";
import { getData } from "../api/api";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../components/TableData/Table";
import { getPersonStudyData } from "../service/service";
// import { MyTable } from "../components/TableData/Table";

// Definir la interfaz para la respuesta de la API

const StudyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const study = location.state?.study as StudyData | undefined; // Obtener los datos del estudio
  const [persons, setPersons] = useState<Person[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = await getPersonStudyData(id);
          setDimensions((study?.dimensions as Dimension[]) || []);
          setPersons(data.persons);
        }
      } catch (error) {
        console.error("Error al obtener datos del estudio:", error);
      }
    };

    fetchData();
  }, []);

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
