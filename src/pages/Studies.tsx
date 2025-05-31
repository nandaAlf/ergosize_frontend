/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from "react";

import { StudyData } from "../types";
import CardStudy from "../components/card/CardStudy";
// import Grid from "@mui/material/Grid2";
import Search from "../components/filtros/Search";
import SelectFilter from "../components/filtros/Selct";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StudyForm from "../components/Forms/StudyForm";
import TableForm from "../components/Forms/TableForm";
import ApiService from "../api/ApiService";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { getAllStudies } from "../service/service";
import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterPanelLayout from "../components/FilterPanelStudies";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useLocation } from "react-router-dom";
import { useNotify } from "../hooks/useNotifications";
import { useDialogs } from "@toolpad/core/useDialogs";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const PAGE_SIZE = 2; // Estudios por página

const Studies: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mine = params.get("mine") === "true";
  const notify = useNotify();
  const dialogs = useDialogs();

  const [studiesData, setStudiesData] = useState<StudyData[] | null>(null); //
  const [openStudyForm, setOpenStudyForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sexoFilter, setSexoFilter] = useState("");
  const [ordenFilter, setOrdenFilter] = useState("");
  const [fechaDesde, setFechaDesde] = useState<Dayjs | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Dayjs | null>(null);
  const [openTableForm, setOpenTableForm] = useState(false);
  const [selectedStudyForTable, setSelectedStudyForTable] =
    useState<StudyData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  // const [selectedStudy, setSelectedStudy] = useState(null);
  // const [selectedCard, setSelectedCard] = React.useState(-1);
  // const [searchType, setSearchType] = useState<"name" | "location">("name"); // Estado para el tipo de búsqueda
  // const [FilterType, setFilterType] = useState<"date" | "estatus">("date"); // Estado para el tipo de búsqueda

  // Memoized fetch function
  const fetchStudies = useCallback(async () => {
    if (currentPage == 0) setLoading(true);
    try {
      // alert(currentPage);
      const { results, count } = await getAllStudies(
        mine,
        currentPage,
        PAGE_SIZE,
        {
          searchTerm,
          sexoFilter,
          ordenFilter,
          fechaDesde: fechaDesde?.format("YYYY-MM-DD") || null,
          fechaHasta: fechaHasta?.format("YYYY-MM-DD") || null,
        }
      );
      setStudiesData(results);
      setTotalItems(count);
      setTotalPages(Math.ceil(count / PAGE_SIZE));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Error al cargar estudios");
      notify.error("Error al cargar estudios");
    } finally {
      setLoading(false);
    }
  }, [currentPage, mine, searchTerm, sexoFilter, ordenFilter, fechaDesde, fechaHasta, notify]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchStudies();
  }, [refreshCounter, mine, currentPage,sexoFilter, setSexoFilter]);

  // useEffect(() => {
  // const fetchStudies = async () => {
  //   try {
  //     const data = await getAllStudies(mine, currentPage, PAGE_SIZE);
  //     console.log(data);
  //     // const result = await dialogs.open(MyCustomDialog);
  //     setStudiesData(data);
  //   } catch (err) {
  //     setError(`No se pudieron obtener los estudios`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //   fetchStudies();
  // }, [mine, refreshCounter, currentPage]);

  // Componente de paginación
  const PaginationControls = useMemo(
    () => (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Anterior
        </Button>

        <Typography sx={{ mx: 2 }}>
          Página {currentPage} de {totalPages}
        </Typography>

        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Siguiente
        </Button>
      </Box>
    ),
    [currentPage, totalPages]
  );
  // Memoized filtered studies
  const filteredStudies = useMemo(() => {
    return studiesData
      ?.filter((study) => {
        // 1) Búsqueda por nombre o ubicación
        const term = searchTerm.trim().toLowerCase();
        if (
          term &&
          !study.name.toLowerCase().includes(term) &&
          !study.location?.toLowerCase().includes(term) &&
          !study.country?.toLowerCase().includes(term)
        ) {
          return false;
        }

        // 2) Filtrar por sexo
        if (sexoFilter && study.gender !== sexoFilter) return false;

        // 3) Filtrar por rango de fecha
        const start = study.start_date ? dayjs(study.start_date) : null;
        const end = study.end_date ? dayjs(study.end_date) : null;

        if (fechaDesde && (!start || !start.isSameOrAfter(fechaDesde, "day")))
          return false;
        if (fechaHasta && (!end || !end.isSameOrBefore(fechaHasta, "day")))
          return false;

        return true;
      })
      .sort((a, b) => {
        if (ordenFilter === "reciente") {
          return dayjs(b.start_date).diff(dayjs(a.start_date));
        }
        if (ordenFilter === "antiguo") {
          return dayjs(a.start_date).diff(dayjs(b.start_date));
        }
        return 0;
      });
  }, [
    studiesData,
    searchTerm,
    sexoFilter,
    ordenFilter,
    fechaDesde,
    fechaHasta,
  ]);
  // const filteredStudies = studiesData
  //   ?.filter((study) => {
  //     // 1) Búsqueda por nombre o ubicación
  //     const term = searchTerm.trim().toLowerCase();
  //     const matchesSearch =
  //       !term ||
  //       study.name.toLowerCase().includes(term) ||
  //       study.location.toLowerCase().includes(term) ||
  //       study.country.toLowerCase().includes(term);

  //     if (!matchesSearch) return false;

  //     // 2) Filtrar por sexo
  //     if (sexoFilter && study.gender !== sexoFilter) return false;

  //     // 3) Filtrar por rango de fecha (start_date / end_date)
  //     const start = fechaDesde ? dayjs(study.start_date) : null;
  //     const end = fechaHasta ? dayjs(study.end_date) : null;

  //     if (fechaDesde && (!start || !start.isSameOrAfter(fechaDesde, "day")))
  //       return false;
  //     if (fechaHasta && (!end || !end.isSameOrBefore(fechaHasta, "day")))
  //       return false;

  //     return true;
  //   })
  //   // 4) Ordenar según ordenFilter
  //   .sort((a, b) => {
  //     if (ordenFilter === "reciente") {
  //       // más reciente primero (por start_date)
  //       return dayjs(b.start_date).diff(dayjs(a.start_date));
  //     }
  //     if (ordenFilter === "antiguo") {
  //       // más antiguo primero
  //       return dayjs(a.start_date).diff(dayjs(b.start_date));
  //     }
  //     return 0; // sin orden
  //   });
  // Función para actualizar la lista
  // const handleStudyUpdate = () => {
  //   setRefreshCounter((prev) => prev + 1);
  // };
  // const handleCloseStudyForm = () => {
  //   setOpenStudyForm(false);
  //   setEditingStudy(null);
  // };
  // const handleEditStudy = (study: StudyData) => {
  //   setEditingStudy(study);
  //   setOpenStudyForm(true);
  // };
  // const handleOpenTableDialog = (study: StudyData) => {
  //   setSelectedStudyForTable(study);
  //   setOpenTableForm(true);
  // };
  // Memoized callbacks
  const handleStudyUpdate = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  const handleCloseStudyForm = useCallback(() => {
    setOpenStudyForm(false);
    setEditingStudy(null);
  }, []);

  const handleEditStudy = useCallback((study: StudyData) => {
    setEditingStudy(study);
    setOpenStudyForm(true);
  }, []);

  const handleOpenTableDialog = useCallback((study: StudyData) => {
    setSelectedStudyForTable(study);
    setOpenTableForm(true);
  }, []);

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

  return (
    <Box sx={{ width: "100%" }}>
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
        onOpenStudyForm={setOpenStudyForm}
      />

      {/* </Box> */}
      {filteredStudies?.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">
            No se encontraron estudios con los filtros aplicados
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm("");
              setSexoFilter("");
              setOrdenFilter("");
              setFechaDesde(null);
              setFechaHasta(null);
            }}
            sx={{ mt: 2 }}
          >
            Limpiar filtros
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ padding: "25px" }}>
            {filteredStudies?.map((study, index) => (
              <Grid
                size={{ xs: 12, sm: 6 }}
                key={study.id}
                sx={{ minHeight: "65%" }}
              >
                <CardStudy
                  study={study}
                  selected={false}
                  onEdit={() => handleEditStudy(study)}
                  onOpenTable={handleOpenTableDialog} // Pasar la función al componente
                  onSelect={() => {}}
                  onViewMeasurements={function (study: StudyData): void {
                    throw new Error("Function not implemented.");
                  }}
                  onSuccess={handleStudyUpdate}
                />
              </Grid>
            ))}
          </Grid>
          {PaginationControls}
        </>
      )}

      <StudyForm
        open={openStudyForm}
        onClose={handleCloseStudyForm}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
        initialData={editingStudy ? editingStudy : undefined}
        mode={editingStudy ? "edit" : "add"}
        onSuccess={handleStudyUpdate} // Agrega esta prop
      ></StudyForm>

      {/* Integración del TableForm a nivel global en la página Studies */}
      {selectedStudyForTable && (
        <TableForm
          open={openTableForm}
          onClose={() => setOpenTableForm(false)}
          study={selectedStudyForTable}
        />
      )}

      {/* <PaginationControls /> */}
    </Box>
  );
};

// export default Studies;
export default React.memo(Studies);
