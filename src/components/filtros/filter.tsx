import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
interface FiltrosProps {
  onFiltrar: (filtros: any) => void;
}

const Filtros: React.FC<FiltrosProps> = ({ onFiltrar }) => {
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [sexo, setSexo] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const handleFiltrar = () => {
    const filtros = {
      nombre,
      pais,
      sexo,
      fechaInicio,
      fechaFin,
    };
    onFiltrar(filtros);
  };

  const handleLimpiar = () => {
    setNombre("");
    setPais("");
    setSexo("");
    setFechaInicio(null);
    setFechaFin(null);
    onFiltrar({});
  };

  return (
    <Paper sx={{ padding: 2, marginBottom: 2, marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="País"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            fullWidth
              size="small"
        />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sexo</InputLabel>
            <Select
              value={sexo}
              onChange={(e) => setSexo(e.target.value as string)}
              label="Sexo"
                size="small"
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
              <MenuItem value="mixto">Mixto</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <DatePicker /> */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de inicio"
              // value={fechaInicio}
              // onChange={(newValue: Date | null) => setFechaInicio(newValue)}
              //   renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
              slotProps={{
                textField: {
                  size: 'small', // Hace el input del DatePicker más pequeño
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de fin"
              // value={fechaFin}
              // onChange={(newValue: Date | null) => setFechaFin(newValue)}
              //   renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
              slotProps={{
                textField: {
                  size: 'small', // Hace el input del DatePicker más pequeño
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button variant="contained" onClick={handleFiltrar}>
            Aplicar filtros
          </Button>
          <Button variant="outlined" onClick={handleLimpiar}>
            Limpiar filtros
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Filtros;
