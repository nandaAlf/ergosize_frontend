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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Dimension, Person } from "../../types";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import DateSelect from "../filtros/date";
import dayjs, { Dayjs } from "dayjs";

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  dimensions: Dimension[]; // Lista de dimensiones del grupo
  studyId: number;
  personId?: number; // ID de la persona (si se está editando)
}
interface Measurement {
  dimension_id: number;
  value: number | null;
  position: "P" | "S";
  date: string;
}
const PersonForm: React.FC<PersonFormProps> = ({
  open,
  onClose,
  mode,
  dimensions,
  studyId,
  personId,
}) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  // const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [province, setProvince] = useState("");
  // const [dateOfMeasurement, setDateOfMeasurement] = useState<string | null>(
  //   null
  // );
  // Single measurement date for all dimensions
  //  const [dateOfMeasurement, setDateOfMeasurement] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [dateOfMeasurement, setDateOfMeasurement] = useState<Dayjs | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = async () => {
    // Validaciones
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "El nombre es requerido";
    if (!gender) newErrors.gender = "El sexo es requerido";
    if (!dateOfBirth)
      newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
    if (!country) newErrors.country = "El país es requerido";
    if (!state) newErrors.state = "El estado es requerido";
    if (!dateOfMeasurement)
      newErrors.dateOfMeasurement = "La fecha de medición es requerida";

    // Si hay errores, se detiene el envío
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2) Preparar sólo las mediciones con valor
    const validMeasurements = measurements
      .filter((m) => m.value !== null)
      .map((m) => ({
        dimension_id: m.dimension_id,
        value: m.value!,
        position: m.position,
        study_id: studyId,
        date: dateOfMeasurement ? dateOfMeasurement.format("YYYY-MM-DD") : "",
      }));

    // const personDataToSave = {
    //   name,
    //   gender,
    //   date_of_birth: dateOfBirth?.format("YYYY-MM-DD") || "",
    //   country,
    //   state,
    //   province,
    //   measurements: measurements.map((m) => ({
    //     dimension_id: m.dimension_id,
    //     value: m.value,
    //     position: m.position, // Puedes agregar un campo para seleccionar la posición si es necesario
    //     study_id: studyId,
    //     date: dateOfMeasurement?.format("YYYY-MM-DD") || "", // Fecha de medición
    //   })),
    // };

    // 3) Construir el payload de forma condicional
    const payload: any = {
      name,
      gender,
      date_of_birth: dateOfBirth ? dateOfBirth.format("YYYY-MM-DD") : "",
      country,
      state,
      province,
    };
    if (validMeasurements.length > 0) {
      payload.measurements = validMeasurements;
    }
    try {
      setIsLoading(true);

      if (mode === "add") {
        await axios.post("http://127.0.0.1:8000/api/persons/", payload);
      } else if (mode === "edit" && personId) {
        // PATCH en lugar de PUT para no borrar las mediciones faltantes
        await axios.put(
          `http://127.0.0.1:8000/api/persons/${personId}/`,
          payload
        );
        console.log("edit", payload);
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar la persona:", error);
    } finally {
      setIsLoading(false);
    }
    // try {
    //   setIsLoading(true);
    //   console.log("Save");
    //   console.log(personDataToSave);
    //   if (mode === "add") {
    //     alert("agregando")
    //     await axios.post(
    //       "http://127.0.0.1:8000/api/persons/",
    //       personDataToSave
    //     );
    //   } else if (mode === "edit" && personData?.id) {
    //     alert("editando")
    //     await axios.put(
    //       `http://127.0.0.1:8000/api/persons/${personData.id}/`,
    //       personDataToSave
    //     );
    //   }
    //   onClose(); // Cerrar el formulario después de guardar
    // } catch (error) {
    //   console.error("Error al guardar la persona:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    if (mode === "edit" && personId) {
      setIsLoading(true);
      // Obtener los datos adicionales de la persona desde la API
      axios
        .get(`http://127.0.0.1:8000/api/persons/${personId}/`)
        .then((response) => {
          const fullPersonData = response.data;
          setName(fullPersonData.name);
          setGender(fullPersonData.gender);
          setDateOfBirth(dayjs(fullPersonData.date_of_birth));
          setCountry(fullPersonData.country);
          setState(fullPersonData.state);
          setProvince(fullPersonData.province);
          setDateOfMeasurement(dayjs(fullPersonData.measurements[0]?.date));
          console.log(response.data);
          const initialMeasurements: Measurement[] =
            fullPersonData.measurements.map((m: any) => ({
              dimension_id: m.dimension_id,
              value: m.value,
              position: m.position, // "P" o "S"
              date: m.date.split("T")[0], // "YYYY-MM-DD"
            }));
          setMeasurements(initialMeasurements);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de la persona:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // if (personData) {
    //   console.log("personData", personData);
    //   // setName(personData.name);
    //   // Mapear las medidas de personData al estado measurements
    //   const initialMeasurements = Object.entries(personData.dimensions)
    //     .map(([dimensionName, value]) => {
    //       const dimension = dimensions.find((d) => d.name === dimensionName);
    //       return {
    //         dimension_id: dimension ? dimension.id_dimension : -1, // Obtener el ID de la dimensión
    //         value: value,
    //         position: "P" as "P" | "S",
    //         date: dayjs("2020-02-02").format("YYYY-MM-DD"), // Cambia esto según sea necesario
    //       };
    //     })
    //     .filter((m) => m.dimension_id !== -1); // Filtrar dimensiones no encontradas

    //   setMeasurements(initialMeasurements);
    // }
  }, [personId, dimensions]);

  const handleMeasurementChange = (dimensionId: number, value: string) => {
    const numericValue = value === "" ? null : parseFloat(value);
    setMeasurements((prev) => {
      const existingIndex = prev.findIndex(
        (m) => m.dimension_id === dimensionId
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].value = numericValue;
        return updated;
      } else {
        return [
          ...prev,
          {
            dimension_id: dimensionId,
            value: numericValue,
            position: "P",
            date: dateOfMeasurement?.format("YYYY-MM-DD") || "",
          }, // Cambia "P" a "S" si es necesario
        ];
      }
    });
  };

  const handlePositionToggle = (dimensionId: number) => {
    setMeasurements((prev) =>
      prev.map((m) =>
        m.dimension_id === dimensionId
          ? { ...m, position: m.position === "P" ? "S" : "P" }
          : m
      )
    );
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
            required
            error={!!errors.name}
            helperText={errors.name}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Sexo</InputLabel>
            <Select
              value={gender || ""}
              onChange={(e) => setGender(e.target.value as string)}
              label="Sexo"
              size="small"
              error={!!errors.gender}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </Select>
            {errors.gender && (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginLeft: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.gender}
              </p>
            )}
          </FormControl>

          <DateSelect
            value={dateOfBirth}
            onDateChange={setDateOfBirth}
            label="Fecha de nacimiento"
          />
          {errors.dateOfBirth && (
            <p style={{ color: "red", fontSize: "13px", marginLeft: "12px" }}>
              {errors.dateOfBirth}
            </p>
          )}

          {/* <TextField
            margin="dense"
            label="Fecha de nacimiento"
            type="date"
            fullWidth
            value={dateOfBirth || ""}
            onChange={(e) => setDateOfBirth(e.target.value)}
            size="small"
            required
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
          /> */}
          <TextField
            margin="dense"
            label="País"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            size="small"
            error={!!errors.country}
            helperText={errors.country}
          />
          <TextField
            margin="dense"
            label="Estado"
            fullWidth
            value={state}
            onChange={(e) => setState(e.target.value)}
            size="small"
            error={!!errors.state}
            helperText={errors.state}
          />
          <DateSelect
            label="Fecha de medición"
            value={dateOfMeasurement}
            onDateChange={setDateOfMeasurement}
          />
          {errors.dateOfMeasurement && (
            <p style={{ color: "red", fontSize: "13px", marginLeft: "12px" }}>
              {errors.dateOfMeasurement}
            </p>
          )}
          {/* <TextField
            margin="dense"
            label="Fecha de medición"
            type="date"
            fullWidth
            value={dateOfMeasurement || ""}
            onChange={(e) => setDateOfMeasurement(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dateOfMeasurement}
            helperText={errors.dateOfMeasurement}
          /> */}
          {dimensions.map((dimension) => {
            const measurement = measurements.find(
              (m) => m.dimension_id === dimension.id_dimension
            );
            return (
              <Grid
                container
                spacing={1}
                alignItems="center"
                key={dimension.id_dimension}
              >
                {/* <Grid item xs={8}> */}
                <TextField
                  margin="dense"
                  label={dimension.name}
                  type="number"
                  fullWidth
                  size="small"
                  value={measurement?.value ?? ""}
                  onChange={(e) =>
                    handleMeasurementChange(
                      dimension.id_dimension,
                      e.target.value
                    )
                  }
                />
                {/* </Grid> */}

                {/* <Grid item xs={4}> */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={measurement?.position === "P"}
                      onChange={() =>
                        handlePositionToggle(dimension.id_dimension)
                      }
                      color="primary"
                    />
                  }
                  label={measurement?.position === "P" ? "Parado" : "Sentado"}
                />
                {/* </Grid> */}
              </Grid>
            );
          })}
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
