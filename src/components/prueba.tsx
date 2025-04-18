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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
}: FilterPanelProps) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);
  const handleClear = () => {
    onSexoChange("");
    onOrdenChange("");
    onFechaDesdeChange(null);
    onFechaHastaChange(null);
  };

  return (
    <Box p={2}>
      {/* Search Bar */}
      <TextField
        label="Buscar por nombre o ubicación"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={toggleDrawer} edge="end">
              <FilterListIcon />
            </IconButton>
          ),
        }}
      />

      {/* Active Filters */}
      <Stack direction="row" spacing={1} mt={2}>
        {sexo && <Chip label={`Sexo: ${sexo}`} onDelete={() => onSexoChange("")} />}
        {orden && <Chip label={`Orden: ${orden}`} onDelete={() => onOrdenChange("")} />}
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

      {/* Filter Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
        <Box p={3} width={300} role="presentation">
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Sexo</InputLabel>
            <Select
              value={sexo}
              label="Sexo"
              onChange={(e) => onSexoChange(e.target.value as string)}
            >
                
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
              <MenuItem value="MF">Mixto</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={orden}
              label="Ordenar por"
              onChange={(e) => onOrdenChange(e.target.value as string)}
            >
              <MenuItem value="reciente">Más reciente</MenuItem>
              <MenuItem value="antiguo">Más antiguo</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Desde"
              value={fechaDesde}
              onChange={(newVal) => onFechaDesdeChange(newVal)}
              format="DD/MM/YYYY"
            />
            <DatePicker
              label="Hasta"
              value={fechaHasta}
              onChange={(newVal) => onFechaHastaChange(newVal)}
              format="DD/MM/YYYY"
            />
              </LocalizationProvider>
          </Box>

          <Button fullWidth sx={{ mt: 3 }} variant="outlined" onClick={handleClear}>
            Limpiar filtros
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
