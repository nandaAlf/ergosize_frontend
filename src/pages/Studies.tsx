import { useEffect, useState } from "react";
import { getData } from "../api/api";
import { studyDataProps } from "../types";
import CardStudy from "../components/card/CardStudy";

import Grid from "@mui/material/Grid2";
import Search from "../components/filtros/Search";
import SelectFilter from "../components/filtros/Selct";
import { SwitchFilter } from "../components/filtros/Switch";
import Paper from "@mui/material/Paper";
const Studies: React.FC = () => {
  // const [studiesData, setStudiesData] = useState(null);
  const [studiesData, setStudiesData] = useState<studyDataProps[] | null>(null); //
  const [searchName, setSearchName] = useState<string>(""); // Estado para el término de búsqueda
  const [searchCountry, setSearchCountry] = useState<string>(""); // Estado para el término de búsqueda
  const [searchSex, setSearchSex] = useState<string>(""); // Estado para el filtro de sexo

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

  // Función para manejar cambios en el campo de búsqueda
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (type == "name") setSearchName(event.target.value);
    if (type == "country") setSearchCountry(event.target.value);
  };
  // Función para manejar cambios en el filtro de sexo
  const handleSexChange = (value: string) => {
    setSearchSex(value);
  };
  // Filtrar los estudios en función del término de búsqueda
  const filteredStudies = studiesData?.filter(
    (study) =>
      study.name.toLowerCase().includes(searchName.toLowerCase()) &&
      study.country.toLowerCase().includes(searchCountry.toLowerCase())
    // (searchSex === "mixto" || study.gender === searchSex)
  );

  return (
    <section>
      {/* <div
        style={{
          backgroundColor: "#f0f0f0ff",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      > */}
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            // width: '99%',
            marginTop:'20px',
            marginBottom:"10px",
            backgroundColor: "#f0f0f0ff",
         
          }}
        >
          <div style={{marginLeft:"25px"}}>

          <Search
            text={"Nombre"}
            onChange={(event) => handleSearchChange(event, "name")}
            ></Search>
            </div>
          <Search
            text={"Pais"}
            onChange={(event) => handleSearchChange(event, "country")}
          ></Search>
          {/* Componente de selección de sexo */}
          <SelectFilter text="Sexo" onChange={handleSexChange} />
          <SwitchFilter></SwitchFilter>
        </Paper>
      {/* </div> */}
      <Grid
        container
        spacing={2}
        sx={{ padding: "25px", backgroundColor: "#f0f0f0ff" }}
      >
        {filteredStudies?.map((study) => (
          <Grid size={{ xs: 12, sm: 6 }} key={study.id}>
            <CardStudy
              name={study.name}
              description={study.description}
              location={study.location}
              country={study.country}
              id={study.id}
              start_date={"1/2/2025"}
              end_date={""}
            />
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default Studies;
