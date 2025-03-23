import { useEffect, useState } from "react";
import { getData } from "../api/api";
import { studyDataProps } from "../types";
import CardStudy from "../components/card/CardStudy";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Importar el ícono de añadir
import Grid from "@mui/material/Grid2";
import Search from "../components/filtros/Search";
import SelectFilter from "../components/filtros/Selct";
import { SwitchFilter } from "../components/filtros/Switch";
import Paper from "@mui/material/Paper";
import { ActionButton } from "../components/Button/AddButton";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
const Studies: React.FC = () => {
  // const [studiesData, setStudiesData] = useState(null);
  const [studiesData, setStudiesData] = useState<studyDataProps[] | null>(null); //
  const [searchName, setSearchName] = useState<string>(""); // Estado para el término de búsqueda
  const [searchCountry, setSearchCountry] = useState<string>(""); // Estado para el término de búsqueda
  const [searchSex, setSearchSex] = useState<string>(""); // Estado para el filtro de sexo
  const [selectedCard, setSelectedCard] = React.useState(-1);
  const [sex, setSex] = useState("");
  const [searchType, setSearchType] = useState<"name" | "location">("name"); // Estado para el tipo de búsqueda
  const [FilterType, setFilterType] = useState<"date" | "estatus">("date"); // Estado para el tipo de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  // Función para manejar cambios en el tipo de búsqueda
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value as "name" | "location");
    setSearchTerm(""); // Limpiar el término de búsqueda al cambiar el tipo
  };

  const filteredStudies = studiesData?.filter((study) => {
    if (searchType === "name") {
      return study.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === "location") {
      return (
        study.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });
  const searchTypeItems = [
    { value: "name", label: "Nombre" },
    { value: "location", label: "Ubicación" },
  ];
  const orderItemsBy = [
    { value: "date", label: "Más recientes" },
    { value: "estatus", label: "Finalizados" },
    // { value: "estatus", label: "Finalizados" },
  ];

  return (
    <section>
      <Box
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "99%",
          marginTop: "20px",
          marginLeft: "20px",
          // marginBottom: "10px",
          // backgroundColor: "#f0f0f0ff",
          // justifyContent:"center"
        }}
      >
        <Box>
          <Search
            text={`Buscar por ${
              searchType === "name" ? "nombre" : "ubicación"
            }`}
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </Box>

        <SelectFilter
          text=""
          value={searchType}
          items={searchTypeItems}
          onChange={handleSearchTypeChange}
        />
        <SelectFilter
          text=""
          value={FilterType}
          items={orderItemsBy} onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          } }        
        />

        <div>
          {/* Botón con ícono de añadir */}
          {/* <ActionButton
            title="Añadir"
            // onAction={handleAdd}
            icon={<AddIcon />}
            onAction={function (): void {
              throw new Error("Function not implemented.");
            }}
          /> */}

          <Button variant="contained">Nuevo Estudio</Button>
          {/* Botón con ícono de eliminar
          <ActionButton
            title="Eliminar"
            // onAction={handleDelete}
            icon={<DeleteIcon />}
            onAction={function (): void {
              throw new Error("Function not implemented.");
            }}
          /> */}
        </div>
      </Box>

      <Grid container spacing={3} sx={{ padding: "25px" }}>
        {filteredStudies?.map((study, index) => (
          <Grid
            size={{ xs: 12, sm: 4 }}
            key={study.id}
            sx={{ minHeight: "65%" }}
          >
            <CardStudy
              {...study}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              index={index}
            />
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default Studies;
