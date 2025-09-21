/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Box, Drawer,
  Typography,
  FormControl, Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Dayjs } from "dayjs";
import Search from "./filtros/Search";
import SelectFilter from "./filtros/Selct";
import DateSelect from "./filtros/date";
import AddIcon from "@mui/icons-material/Add";
import { parseJwt } from "../hooks/parseJwt";
export interface FilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  sexo: string;
  onSexoChange: (value: string) => void;
  orden: string;
  onOrdenChange: (value: string) => void;
  fechaDesde: Dayjs | null;
  onFechaDesdeChange: (value: Dayjs | null) => void;
  fechaHasta: Dayjs | null;
  onFechaHastaChange: (value: Dayjs | null) => void;
  openStudyForm: boolean;
  onOpenStudyForm: (open: boolean) => void;
}
export default function FilterPanelLayout({
  search,
  onSearchChange,
  sexo,
  onSexoChange,
  orden,
  onOrdenChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  openStudyForm,
  onOpenStudyForm,
}: FilterPanelProps) {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);
  const handleClear = () => {
    onSexoChange("");
    onOrdenChange("");
    onFechaDesdeChange(null);
    onFechaHastaChange(null);
  };

  // roles
  const token = localStorage.getItem("access_token");
  const payload: any = token ? parseJwt(token) : null;
  const role: string = payload?.role;
  const canCreate = role === "admin" || role === "investigador";

  const genderTypeItems = [
    { value: "F", label: "Femenino" },
    { value: "M", label: "Masculino" },
    { value: "MF", label: "Mixto" },
  ];
  const orderTypeItems = [
    { value: "reciente", label: "Más Recientes" },
    { value: "antiguos", label: "Más Antiguos" },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="60%"
      pt={5}
      ml={3}
      gap={2}
    >
      {/* Top controls: search + buttons */}
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: "70%" }}>
          <Search
            text="Buscar"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFilterClick={toggleDrawer}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          {/* <Button variant="outlined" size="small" onClick={toggleDrawer}>
            <FilterListIcon /> Filtrar
          </Button> */}
          {canCreate && (
            <Button
              variant="contained"
              size="small"
              // margin="dense"
              onClick={() => onOpenStudyForm(true)}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                p: "7px",
              }}
            >
              <AddIcon /> Crear estudio
            </Button>

          )}
        </Stack>
      </Box>

      {/* Active Filters */}
      <Box mt={1}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {sexo && (
            <Chip label={`Sexo: ${sexo}`} onDelete={() => onSexoChange("")} />
          )}
          {orden && (
            <Chip
              label={`Orden: ${orden}`}
              onDelete={() => onOrdenChange("")}
            />
          )}
          {fechaDesde && (
            <Chip
              label={`Desde: ${fechaDesde.format("DD/MM/YYYY")}`}
              onDelete={() => onFechaDesdeChange(null)}
            />
          )}
          {fechaHasta && (
            <Chip
              label={`Hasta: ${fechaHasta.format("DD/MM/YYYY")}`}
              onDelete={() => onFechaHastaChange(null)}
            />
          )}
        </Stack>
      </Box>

      {/* Filter Drawer with higher z-index */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          zIndex: theme.zIndex.appBar + 150,
        }}
      >
        <Box p={3} width={300}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Divider />

          <FormControl fullWidth margin="normal">
            <SelectFilter
              text="Género"
              value={sexo}
              onChange={(val) => onSexoChange(val)}
              items={genderTypeItems}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <SelectFilter
              text="Ordenar"
              value={orden}
              onChange={(val) => onOrdenChange(val)}
              items={orderTypeItems}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <DateSelect
              value={fechaDesde}
              onDateChange={onFechaDesdeChange}
              label="Desde"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <DateSelect
              value={fechaHasta}
              onDateChange={onFechaHastaChange}
              label="Hasta"
            />
          </FormControl>

          <Button
            fullWidth
            sx={{ mt: 3 }}
            variant="outlined"
            onClick={handleClear}
          >
            Limpiar filtros
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
