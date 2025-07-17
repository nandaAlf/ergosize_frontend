/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLocation, useParams } from "react-router-dom";
import { Dimension, Person, StudyData } from "../types";
import { getData } from "../api/api";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../components/TableData/Table";
import { getPersonStudyData } from "../service/service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import { MyTable } from "../components/TableData/Table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Definir la interfaz para la respuesta de la API

const StudyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const study = location.state?.study as StudyData | undefined; // Obtener los datos del estudio
  const [persons, setPersons] = useState<Person[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  //  ← Nuevo estado para búsqueda

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };
  const [searchTerm, setSearchTerm] = useState("");
  //  ← Filtra las personas aquí
  const filteredPersons = React.useMemo(
    () =>
      persons.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [persons, searchTerm]
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = await getPersonStudyData(id);
          setPersons(data.persons);
        }
      } catch (error) {
        console.error("Error al obtener datos del estudio:", error);
      }
    };

    fetchData();
  }, [refreshCounter]);


  if (!study) {
    return <div>Estudio no encontrado</div>;
  }


  return (
    <>
      <TableComponent
        dimensions={study.dimensions}
        persons={filteredPersons}
        searchTerm={searchTerm} // Pasa el término de búsqueda al componente
        study_id={study.id || 0}
        onSearchTermChange={setSearchTerm} // Pasa la función de cambio de búsqueda
        study_name={study.name}
        size={study.size ?? 0}
        current_size={study.current_size ?? 0}
        onRefresh={handleRefresh}
   
      ></TableComponent>
    </>
  );
};

export default StudyDetail;
