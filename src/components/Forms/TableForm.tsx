import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
  Button,
  Chip,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { StudyData } from "../../types";
import axios from "axios";

const availablePercentiles = [0, 5, 10, 25, 50, 75, 90, 95];

interface TableFormProps {
  open: boolean;
  onClose: () => void;
  study: StudyData;
}

const TableForm: React.FC<TableFormProps> = ({ open, onClose, study }) => {
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [ageMin, setAgeMin] = useState<string>("");
  const [ageMax, setAgeMax] = useState<string>("");

  // Para dimensiones: Select múltiple, los valores son los IDs
  const [selectedDimensions, setSelectedDimensions] = useState<number[]>([]);
  const handleDimensionsChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedDimensions(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  // Para percentiles: uso de checkboxes para seleccionar opciones
  const [selectedPercentiles, setSelectedPercentiles] = useState<number[]>([]);
  const togglePercentile = (p: number) => {
    if (selectedPercentiles.includes(p)) {
      setSelectedPercentiles(selectedPercentiles.filter((val) => val !== p));
    } else {
      setSelectedPercentiles([...selectedPercentiles, p]);
    }
  };

  const handleGenerateTable = async () => {
    const params = new URLSearchParams();
    if (study.id )params.append("studyId", (study.id).toString());
    else return
    if (genderFilter) params.append("gender", genderFilter);
    if (ageMin) params.append("age_min", ageMin);
    if (ageMax) params.append("age_max", ageMax);
    if (selectedDimensions.length > 0)
      params.append("dimensions", selectedDimensions.join(","));
    if (selectedPercentiles.length > 0)
      params.append("percentiles", selectedPercentiles.join(","));

    const url = `/tables/${study.id}/?${params.toString()}`;
    window.open(url, "_blank"); // Abre en nueva pestaña
    onClose(); // Cierra el diálogo
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generar Tabla Antropométrica</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {/* Filtro de género */}
          <FormControl fullWidth>
            <InputLabel id="gender-label">Género</InputLabel>
            <Select
              labelId="gender-label"
              label="Género"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </Select>
          </FormControl>

          {/* Filtro de edad mínima */}
          <TextField
            label="Edad mínima"
            type="number"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            fullWidth
          />

          {/* Filtro de edad máxima */}
          <TextField
            label="Edad máxima"
            type="number"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            fullWidth
          />

          {/* Selección de dimensiones: Select múltiple con chips */}
          <FormControl fullWidth>
            <InputLabel id="dimensions-label">Dimensiones</InputLabel>
            <Select
              labelId="dimensions-label"
              multiple
              value={selectedDimensions}
              onChange={handleDimensionsChange}
              input={<OutlinedInput label="Dimensiones" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as number[]).map((value) => {
                    const dim = study.dimensions?.find(
                      (d) => d.id_dimension === value
                    );
                    return <Chip key={value} label={dim ? dim.name : value} />;
                  })}
                </Box>
              )}
            >
              {study.dimensions?.map((dim) => (
                <MenuItem key={dim.id_dimension} value={dim.id_dimension}>
                  <Checkbox
                    checked={selectedDimensions.indexOf(dim.id_dimension) > -1}
                  />
                  <ListItemText primary={dim.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtro de percentiles: checkboxes independientes */}
          <Box>
            <Typography variant="subtitle1">Percentiles</Typography>
            <FormGroup row>
              {availablePercentiles.map((p) => (
                <FormControlLabel
                  key={p}
                  control={
                    <Checkbox
                      checked={selectedPercentiles.includes(p)}
                      onChange={() => togglePercentile(p)}
                    />
                  }
                  label={p.toString()}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleGenerateTable}>
          Generar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableForm;
