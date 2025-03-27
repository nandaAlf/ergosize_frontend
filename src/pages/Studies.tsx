import { useEffect, useState } from "react";
import { createStudy, getData } from "../api/api";
import { StudyData } from "../types";
import CardStudy from "../components/card/CardStudy";
import Grid from "@mui/material/Grid2";
import Search from "../components/filtros/Search";
import SelectFilter from "../components/filtros/Selct";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import StudyForm from "../components/Forms/StudyForm";
// import StudyForm from "../components/Forms/StudyForm2";
const Studies: React.FC = () => {
  // const [studiesData, setStudiesData] = useState(null);
  const [studiesData, setStudiesData] = useState<StudyData[] | null>(null); //
  const [selectedCard, setSelectedCard] = React.useState(-1);
  const [searchType, setSearchType] = useState<"name" | "location">("name"); // Estado para el tipo de búsqueda
  const [FilterType, setFilterType] = useState<"date" | "estatus">("date"); // Estado para el tipo de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [openStudyForm, setOpenStudyForm] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [editingStudy, setEditingStudy] = useState<StudyData | null>(null);
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
          setStudiesData(response as StudyData[]); // Convertir y guardar los datos
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

  const handleCloseStudyForm = () => {
    setOpenStudyForm(false);
  };
  const handleEditStudy = (study: StudyData) => {
    setEditingStudy(study);
    setOpenStudyForm(true);
  };
  const handleSubmitStudy = async (data: StudyData) => {
    alert("wowo");
    try {
      if (editingStudy) {
        console.log("editar",data)
        // Lógica para actualizar estudio
        // await updateStudy(data);
      } else {
        // Lógica para crear nuevo estudio
        alert("Creando");
        console.log("crear", data);
        await createStudy(data);
      }
      // Refrescar datos
      const response = await getData("studies/");
      setStudiesData(response as StudyData[]);
      setOpenStudyForm(false);
      setEditingStudy(null);
    } catch (error) {
      console.error("Error saving study:", error);
    }
  };
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
          items={orderItemsBy}
          onChange={function (): void {
            throw new Error("Function not implemented.");
          }}
        />

        <div>
          <Button variant="contained" onClick={() => setOpenStudyForm(true)}>
            Nuevo Estudio
          </Button>
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
              // {...study}
              study={study}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              index={index}
              onEdit={() => handleEditStudy(study)}
            />
          </Grid>
        ))}
      </Grid>

      <StudyForm
        open={openStudyForm}
        onClose={() => setOpenStudyForm(false)}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
        initialData={editingStudy ? editingStudy : undefined}
        mode={editingStudy ? 'edit' : 'add'}
      ></StudyForm>
    </section>
  );
};

export default Studies;
