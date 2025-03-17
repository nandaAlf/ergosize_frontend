import { useEffect, useState } from "react";
import { getData } from "../api/api";
import { studyDataProps } from "../types";
import CardStudy from "../components/card/CardStudy";

import Grid from "@mui/material/Grid2";
const Studies: React.FC = () => {
  // const [studiesData, setStudiesData] = useState(null);
  const [studiesData, setStudiesData] = useState<studyDataProps[] | null>(null); //
  useEffect(() => {
    const fetchStudis = async () => {
      try {
        const response = await getData("studies/"); // Usar la función getData
        // setStudiesData(response as studyDataProps[]); // Casteo aquí

        if (
          Array.isArray(response) &&
          response.every(
            (item) =>
              typeof item.name === "string" &&
              typeof item.description === "string" &&
              typeof item.location === "string" &&
              typeof item.country === "string"
          )
        ) {
          setStudiesData(response as studyDataProps[]); // Convertir y guardar los datos
        } else {
          throw new Error(
            "La respuesta de la API no tiene la estructura esperada."
          );
        }
      } catch (error) {
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    };
    fetchStudis();
  }, []);

  const functions = () => {};

  return (
    <>
      HOLA
      <Grid container spacing={1} sx={{ padding: "5px" , backgroundColor:"#f0f0f0ff" }}>
        {studiesData?.map((study) => (
           <CardStudy
            key={study.id} // Usar el ID como clave única
            name={study.name}
            description={study.description}
            location={study.location}
            country={study.country} id={study.id} start_date={"1/2/2025"} end_date={""}         />
        ))}
      </Grid>
    </>
  );
};

export default Studies;
