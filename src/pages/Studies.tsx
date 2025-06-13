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
import { ArrowBack, ArrowForward } from "@mui/icons-material";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const PAGE_SIZE = 3; // Estudios por página

const Studies: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mine = params.get("mine") === "true";
  const notify = useNotify();

  const [studiesData, setStudiesData] = useState<StudyData[]>([]); //
  const [openStudyForm, setOpenStudyForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    sexoFilter: "",
    ordenFilter: "",
    fechaDesde: null as Dayjs | null,
    fechaHasta: null as Dayjs | null,
  });
  // const [sexoFilter, setSexoFilter] = useState("");
  // const [ordenFilter, setOrdenFilter] = useState("");
  // const [fechaDesde, setFechaDesde] = useState<Dayjs | null>(null);
  // const [fechaHasta, setFechaHasta] = useState<Dayjs | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [openTableForm, setOpenTableForm] = useState(false);
  const [selectedStudyForTable, setSelectedStudyForTable] =
    useState<StudyData | null>(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0);
  // const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  // const [selectedStudy, setSelectedStudy] = useState(null);
  // const [selectedCard, setSelectedCard] = React.useState(-1);
  // const [searchType, setSearchType] = useState<"name" | "location">("name"); // Estado para el tipo de búsqueda
  // const [FilterType, setFilterType] = useState<"date" | "estatus">("date"); // Estado para el tipo de búsqueda

  // Memoized fetch function
  const fetchStudies = useCallback(async () => {
    // if (currentPage == 0) setLoading(true);
    try {
      const { results, count } = await getAllStudies(
        mine,
        pagination.currentPage,
        PAGE_SIZE,
        {
          searchTerm: filters.searchTerm,
          sexoFilter: filters.sexoFilter,
          ordenFilter: filters.ordenFilter,
          fechaDesde: filters.fechaDesde?.format("YYYY-MM-DD") || null,
          fechaHasta: filters.fechaHasta?.format("YYYY-MM-DD") || null,
        }
      );
      setStudiesData(results);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(count / PAGE_SIZE),
        totalItems: count,
      }));
      // setTotalItems(count);
      // setTotalPages(Math.ceil(count / PAGE_SIZE));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Error al cargar estudios");
      notify.error("Error al cargar estudios");
    } finally {
      setLoading(false);
    }
  }, [mine, pagination.currentPage, filters, notify, refreshCounter]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchStudies();
  }, [mine, pagination.currentPage, filters, refreshCounter]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters]);

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

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      sexoFilter: "",
      ordenFilter: "",
      fechaDesde: null,
      fechaHasta: null,
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const PaginationControls = useMemo(
    () => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // mt: 3,
          // mb: 2,
          gap: 2,
        }}
      >
        <IconButton
          disabled={pagination.currentPage === 1 || loading}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          size="small"
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="body1">
          Página {pagination.currentPage} de {pagination.totalPages}
        </Typography>

        <IconButton
          disabled={
            pagination.currentPage === pagination.totalPages ||
            pagination.totalPages === 0 ||
            loading
          }
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          size="small"
        >
          <ArrowForward />
        </IconButton>

        <Typography variant="caption" color="text.secondary">
          {pagination.totalItems} estudios en total
        </Typography>
      </Box>
    ),
    [pagination, loading, handlePageChange]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
    <Box
      sx={{
        // width: "100%",
        // height: "100vh",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        // padding: 3,
        margin: "0px 20px",
        // backgroundColor: "#f8f9fa",
        borderRadius: 2,
        // boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        height: "100vh",
      }}
    >
      <FilterPanelLayout
        {...filters}
        search={filters.searchTerm}
        sexo={filters.sexoFilter}
        orden={filters.ordenFilter}
        fechaDesde={filters.fechaDesde}
        fechaHasta={filters.fechaHasta}
        onSearchChange={(value) => handleFilterChange({ searchTerm: value })}
        onSexoChange={(value) => handleFilterChange({ sexoFilter: value })}
        onOrdenChange={(value) => handleFilterChange({ ordenFilter: value })}
        onFechaDesdeChange={(value) =>
          handleFilterChange({ fechaDesde: value })
        }
        onFechaHastaChange={(value) =>
          handleFilterChange({ fechaHasta: value })
        }
        openStudyForm={openStudyForm}
        onOpenStudyForm={() => setOpenStudyForm(true)}
      />
      {/* {PaginationControls} */}
      {/* </Box> */}
      {studiesData?.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">
            No se encontraron estudios con los filtros aplicados
          </Typography>
          <Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>
            Limpiar filtros
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ padding: "5px", margin: "0 20px" }}>
            {studiesData?.map((study, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
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

      {openStudyForm && (
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
      )}
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

// export default Studies;
export default React.memo(Studies);
