// PersonFormDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DimensionData } from "../../types";

interface PersonFormDialogProps {
  open: boolean; // Controla si el diálogo está abierto
  onClose: () => void; // Función para cerrar el diálogo
  onSave: (
    person: {
      name: string;
      gender: string | null;
      date_of_birth: string | null;
      country: string;
      state: string;
      province: string;
    },
    measurements: {
      value: number | null;
      position: string | null;
      study: number; // Ahora el estudio es obligatorio y se pasa como prop
      person: string | null;
      dimension: string | null;
    }[]
  ) => void; // Función para guardar los datos
  dimensions: string[]; // Lista de dimensiones del grupo
  studyId: number; // ID del estudio actual
  mode: "add" | "edit"; // Modo del formulario: 'add' o 'edit'

  personData: {
    // Datos de la persona en modo edición
    id: number; // ID opcional (para edición)
    name: string;
    // gender: string | null;
    // date_of_birth: string | null;
    // country: string;
    // state: string;
    // province: string;
    // dimensions: Record<string, number>; // Mediciones por dimensión
    dimensions: DimensionData;
  };
}

const PersonFormDialog: React.FC<PersonFormDialogProps> = ({
  open,
  onClose,
  onSave,
  dimensions,
  studyId, // ID del estudio actual
  mode,
  personData,
}) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [province, setProvince] = useState("");

  const [measurements, setMeasurements] = useState<
    Record<string, number | null>
  >({}); // Valores de las mediciones por dimensión
  const [measurementPosition, setMeasurementPosition] = useState<string | null>(
    null
  );

  // Prellenar los campos si está en modo edición
  useEffect(() => {
    if (mode === "edit" && personData) {
      console.log("PersonData");
      console.log(personData);

      // Prellenar los campos de la persona
      setName(personData.name);
      // setGender(personData.gender);
      // setDateOfBirth(personData.date_of_birth);
      // setCountry(personData.country);
      // setState(personData.state);
      // setProvince(personData.province);

      const initialMeasurements: Record<string, number | null> = {};
      if (personData.dimensions) {
        Object.entries(personData.dimensions).forEach(([dimension, value]) => {
          if (typeof value === "number" || value === null) {
            initialMeasurements[dimension] = value;
          } else {
            // Si el valor es un string, lo ignoras o lo conviertes a número (si es posible)
            initialMeasurements[dimension] = null; // O podrías usar `parseFloat(value)` si es relevante
          }
        });
      }
      setMeasurements(initialMeasurements);
    }
    //  else {
    //   // Resetear los campos si está en modo añadir
    //   setName("");
    //   setGender(null);
    //   setDateOfBirth(null);
    //   setCountry("");
    //   setState("");
    //   setProvince("");
    //   setMeasurements({});
    //   setMeasurementPosition(null);
    // }
  }, [mode, personData]);

  const handleSave = () => {
    const personData = {
      name,
      gender,
      date_of_birth: dateOfBirth,
      country,
      state,
      province,
    };

    const measurementData = dimensions.map((dimension) => ({
      value: measurements[dimension] || null,
      position: measurementPosition,
      study: studyId, // Usar el ID del estudio actual
      person: name, // Asociar la medición a la persona por su nombre (puedes usar un ID si lo prefieres)
      dimension,
    }));

    onSave(personData, measurementData); // Pasar los datos al componente padre
    onClose(); // Cerrar el diálogo
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* <DialogTitle>Añadir nueva persona y mediciones</DialogTitle> */}
      <DialogTitle>
        {mode === "add" ? "Añadir nueva persona" : "Editar persona"}
      </DialogTitle>
      <DialogContent>
        {/* Formulario para la persona */}
        <TextField
          autoFocus
          margin="dense"
          label="Nombre"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Sexo</InputLabel>
          <Select
            value={gender || ""}
            onChange={(e) => setGender(e.target.value as string)}
            label="Sexo"
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Femenino</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Fecha de nacimiento"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={dateOfBirth || ""}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <TextField
          margin="dense"
          label="País"
          fullWidth
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Estado"
          fullWidth
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Provincia"
          fullWidth
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />

        {/* Formulario para las mediciones */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Posición de medición</InputLabel>
          <Select
            value={measurementPosition || ""}
            onChange={(e) => setMeasurementPosition(e.target.value as string)}
            label="Posición de medición"
          >
            <MenuItem value="P">Parado</MenuItem>
            <MenuItem value="S">Sentado</MenuItem>
          </Select>
        </FormControl>

        {/* Campos para las mediciones de cada dimensión */}
        {dimensions.map((dimension) => (
          <TextField
            key={dimension}
            margin="dense"
            label={`Medición para ${dimension}`}
            type="number"
            fullWidth
            value={measurements[dimension] || ""}
            onChange={(e) =>
              setMeasurements((prev) => ({
                ...prev,
                [dimension]: parseFloat(e.target.value),
              }))
            }
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonFormDialog;
