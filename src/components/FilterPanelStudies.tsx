import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Drawer,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);
  const handleClear = () => {
    onSexoChange("");
    onOrdenChange("");
    onFechaDesdeChange(null);
    onFechaHastaChange(null);
  };
  const genderTypeItems = [
    { value: "F", label: "Femenino" },
    { value: "M", label: "Maculino" },
    { value: "MF", label: "Mixto" },
  ];
  const orderTypeItems = [
    { value: "reciente", label: "Mas Recientes" },
    { value: "antiguos", label: "Mas Antiguos" },
  ];
  // 1. Leer el rol del token
  const token = localStorage.getItem("access_token");
  const payload: any = token ? parseJwt(token) : null;
  const role: string = payload?.role;

  // 2. Determinar si debe verse el botón
  const canCreate = role === "admin" || role === "investigador";

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent={"space-between"}
      width="60%"
      pt={5}
      ml={3}
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        {/* Search con límite de ancho */}
        <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: "70%" }}>
          <Search
            text="Buscar"
            onChange={(e) => onSearchChange(e.target.value)}
            value={search}
          />
        </Box>

        {/* Botones con espacio entre ellos */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            // sx={{ border: "1px solid #2563eb " }}
            onClick={toggleDrawer}
          >
            <FilterListIcon />
            Filtrar
          </Button>
          {/* Solo admins e investigadores ven “Crear” */}
          {canCreate && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onOpenStudyForm(true)}
            >
              <AddIcon /> Crear
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
      {/* Filter Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
        <Box p={3} width={240}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Divider />

          <FormControl fullWidth margin="normal">
            <SelectFilter
              text="Género"
              value={sexo}
              onChange={(value) => onSexoChange(value)}
              items={genderTypeItems}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <SelectFilter
              text="Ordenar"
              value={orden}
              onChange={(value) => onOrdenChange(value)}
              items={orderTypeItems}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <DateSelect
                value={fechaDesde}
                onDateChange={onFechaDesdeChange}
                label="Desde"
              />
              <DateSelect
                value={fechaHasta}
                onDateChange={onFechaHastaChange}
                label="Hasta"
              />
            </Box>
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
