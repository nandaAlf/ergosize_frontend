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
import { useEffect, useState } from "react";
import { Dimension, Person } from "../../types";
import axios from "axios";

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  dimensions: Dimension[]; // Lista de dimensiones del grupo
  studyId: number;
  personData?: Person; // Datos visibles de la persona (nombre, mediciones, etc.)
}
interface Measurement {
  dimension_id: number;
  value: number | null;
}
const PersonForm: React.FC<PersonFormProps> = ({
  open,
  onClose,
  mode,
  dimensions,
  studyId,
  personData,
}) => {
  const [name, setName] = useState(personData?.name || "");
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [province, setProvince] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const personDataToSave = {
      name,
      gender,
      date_of_birth: dateOfBirth,
      country,
      state,
      province,
      measurements: measurements.map((m) => ({
        dimension_id: m.dimension_id,
        value: m.value,
        position: "P", // Puedes agregar un campo para seleccionar la posición si es necesario
        study_id: studyId,
      })),
    };

    try {
      console.log("Save")
      console.log(personDataToSave)
      if (mode === "add") {
        await axios.post(
          "http://127.0.0.1:8000/api/persons/",
          personDataToSave
        );
        // await axios.post(
        //   "http://127.0.0.1:8000/api/persons/",
        //   {
        //     "name": "Juan Pérez",
        //     "gender": "M",
        //     "date_of_birth": "1990-01-01",
        //     "country": "México",
        //     "state": "Ciudad de México",
        //     "province": "Iztapalapa",
        //     "measurements": [
        //         {
        //             "study_id": 1,
        //             "dimension_id": 1,
        //             "value": 180,
        //             "position": "P"
        //         },
        //         {
        //             "study_id": 1,
        //             "dimension_id": 2,
        //             "value": 80,
        //             "position": "P"
        //         }
        //     ]
        // }
        // );
      } else if (mode === "edit" && personData?.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/persons/${personData.id}/`,
          personDataToSave
        );
      }
      onClose(); // Cerrar el formulario después de guardar
    } catch (error) {
      console.error("Error al guardar la persona:", error);
    }
  };

  useEffect(() => {
    if (mode === "edit" && personData?.id) {
      //   setIsLoading(true);
      //   // Obtener los datos adicionales de la persona desde la API
      //   axios.get(`http://127.0.0.1:8000/api/persons/${personData.id}/`)
      //     .then((response) => {
      //       const fullPersonData = response.data;
      //       setGender(fullPersonData.gender);
      //       setDateOfBirth(fullPersonData.date_of_birth);
      //       setCountry(fullPersonData.country);
      //       setState(fullPersonData.state);
      //       setProvince(fullPersonData.province);
      //     })
      //     .catch((error) => {
      //       console.error("Error al obtener los datos de la persona:", error);
      //     })
      //     .finally(() => {
      //       setIsLoading(false);
      //     });
    }
    if (personData) {
      setName(personData.name);
      // Mapear las medidas de personData al estado measurements
      const initialMeasurements = Object.entries(personData.dimensions)
        .map(([dimensionName, value]) => {
          const dimension = dimensions.find((d) => d.name === dimensionName);
          return {
            dimension_id: dimension ? dimension.id : -1, // Obtener el ID de la dimensión
            value: value,
          };
        })
        .filter((m) => m.dimension_id !== -1); // Filtrar dimensiones no encontradas

      setMeasurements(initialMeasurements);
    }
    console.log("aaa", personData?.dimensions);
  }, [personData, dimensions]);

  const handleMeasurementChange = (dimensionId: number, value: string) => {
    const numericValue = value === "" ? null : parseFloat(value);
    setMeasurements((prev) => {
      const existingIndex = prev.findIndex(
        (m) => m.dimension_id === dimensionId
      );
      if (existingIndex !== -1) {
        // Si la medición ya existe, actualiza su valor
        const updatedMeasurements = [...prev];
        updatedMeasurements[existingIndex] = {
          dimension_id: dimensionId,
          value: numericValue,
        };
        return updatedMeasurements;
      } else {
        // Si la medición no existe, agrega una nueva
        return [...prev, { dimension_id: dimensionId, value: numericValue }];
      }
    });
  };
  return (
    <>
      <Dialog open={open} onClose={onClose}>
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
            size="small"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Sexo</InputLabel>
            <Select
              value={gender || ""}
              onChange={(e) => setGender(e.target.value as string)}
              label="Sexo"
              size="small"
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
            value={dateOfBirth || ""}
            onChange={(e) => setDateOfBirth(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="País"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            size="small"
          />
          <TextField
            margin="dense"
            label="Estado"
            fullWidth
            value={state}
            onChange={(e) => setState(e.target.value)}
            size="small"
          />
          const [name, setName] = useState(personData?.name || "");
          {/* Campos para las mediciones de cada dimensión */}
          {dimensions.map((dimension) => (
            <TextField
              key={dimension.id}
              margin="dense"
              label={`${dimension.name}`}
              type="number"
              fullWidth
              // value={
              //   measurements.find((m) => m.dimension_id === dimension.id)
              //     ?.value || ""
              // }
              // onChange={(e) =>
              // handleMeasurementChange(dimension.id, e.target.value)
              // }
              value={measurements.find((m) => m.dimension_id === dimension.id)?.value || ""}
              onChange={(e) => handleMeasurementChange(dimension.id, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PersonForm;
