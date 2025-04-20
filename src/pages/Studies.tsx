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
import TableForm from "../components/Forms/TableForm";
import ApiService from "../api/ApiService";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { getAllStudies } from "../service/service";
import { Container, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterPanelLayout from "../components/FilterPanelStudies";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// import { isSameOrAfter, isSameOrBefore } from 'dayjs'
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sexoFilter, setSexoFilter] = useState("");
  const [ordenFilter, setOrdenFilter] = useState("");
  const [fechaDesde, setFechaDesde] = useState<Dayjs | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Dayjs | null>(null);
  // Estados para el TableForm
  const [openTableForm, setOpenTableForm] = useState(false);
  const [selectedStudyForTable, setSelectedStudyForTable] =
    useState<StudyData | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const data = await getAllStudies();
        setStudiesData(data);
      } catch (err: any) {
        setError("No se pudieron obtener los estudios");
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
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
  // const filteredStudies = studiesData?.filter((study) => {
  //   if (searchType === "name") {
  //     return study.name.toLowerCase().includes(searchTerm.toLowerCase());
  //   } else if (searchType === "location") {
  //     return (
  //       study.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       study.country.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }
  //   return true;
  // });
  const filteredStudies = studiesData
    ?.filter((study) => {
      // 1) Búsqueda por nombre o ubicación
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        study.name.toLowerCase().includes(term) ||
        study.location.toLowerCase().includes(term) ||
        study.country.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      // 2) Filtrar por sexo
      if (sexoFilter && study.gender !== sexoFilter) return false;

      // 3) Filtrar por rango de fecha (start_date / end_date)
      const start = fechaDesde ? dayjs(study.start_date) : null;
      const end = fechaHasta ? dayjs(study.end_date) : null;

      if (fechaDesde && (!start || !start.isSameOrAfter(fechaDesde, "day")))
        return false;
      if (fechaHasta && (!end || !end.isSameOrBefore(fechaHasta, "day")))
        return false;

      return true;
    })
    // 4) Ordenar según ordenFilter
    .sort((a, b) => {
      if (ordenFilter === "reciente") {
        // más reciente primero (por start_date)
        return dayjs(b.start_date).diff(dayjs(a.start_date));
      }
      if (ordenFilter === "antiguo") {
        // más antiguo primero
        return dayjs(a.start_date).diff(dayjs(b.start_date));
      }
      return 0; // sin orden
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
    setEditingStudy(null);
  };
  const handleEditStudy = (study: StudyData) => {
    setEditingStudy(study);
    setOpenStudyForm(true);
  };
  const handleOpenTableDialog = (study: StudyData) => {
    setSelectedStudyForTable(study);
    setOpenTableForm(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body2" mt={3}>
          Cargando estudios...
        </Typography>
      </Box>
    );
  }
  if (error) return <p>{error}</p>;
  return (
    <Box  sx={{ width: "100%" }} >
        <FilterPanelLayout
          search={searchTerm}
          onSearchChange={setSearchTerm}
          sexo={sexoFilter}
          onSexoChange={setSexoFilter}
          orden={ordenFilter}
          onOrdenChange={setOrdenFilter}
          fechaDesde={fechaDesde}
          onFechaDesdeChange={setFechaDesde}
          fechaHasta={fechaHasta}
          onFechaHastaChange={setFechaHasta} 
          openStudyForm={openStudyForm} 
          onOpenStudyForm={setOpenStudyForm}        />
      
      {/* </Box> */}
      <Grid container spacing={3} sx={{ padding: "25px"}}>
        {filteredStudies?.map((study, index) => (
          <Grid
            size={{ xs: 12, sm: 4 }}
            key={study.id}
            sx={{ minHeight: "65%" }}
          >
            <CardStudy
              study={study}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              index={index}
              onEdit={() => handleEditStudy(study)}
              handleOpenTableDialog={handleOpenTableDialog} // Pasar la función al componente
            />
          </Grid>
        ))}
      </Grid>

      <StudyForm
        open={openStudyForm}
        onClose={handleCloseStudyForm}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
        initialData={editingStudy ? editingStudy : undefined}
        mode={editingStudy ? "edit" : "add"}
      ></StudyForm>

      {/* Integración del TableForm a nivel global en la página Studies */}
      {selectedStudyForTable && (
        <TableForm
          open={openTableForm}
          onClose={() => setOpenTableForm(false)}
          study={selectedStudyForTable}
        />
      )}
    </Box>
  );
};

export default Studies;
