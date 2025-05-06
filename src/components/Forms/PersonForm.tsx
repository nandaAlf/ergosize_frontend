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
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Dimension, Person } from "../../types";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import DateSelect from "../filtros/date";
import dayjs, { Dayjs } from "dayjs";
import { AnnotatedImage } from "../AnnotatedImage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel({ children, value, index, ...props }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
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
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [province, setProvince] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [dateOfMeasurement, setDateOfMeasurement] = useState<Dayjs | null>(
    null
  );

  const [showImage, setShowImage] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<number | null>(
    null
  );
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

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
            position: measurements[studyId]?.position || "P",
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
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogTitle>
          {mode === "add" ? "Añadir nueva persona" : "Editar persona"}
        </DialogTitle>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Datos Personales" />
          <Tab label="Datos Antropométricos" />
        </Tabs>
        <DialogContent sx={{ py: 0, px: 4 }}>
          {/* Formulario para la persona */}
          <TabPanel value={tabIndex} index={0}>
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
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
  <Box display="flex" sx={{ mt: 0, minWidth: 500 }}>
    {/* Left Column */}
    <Box
      sx={{
        flex: 1,
        // pr: 2,
        // p: 2,
        // bgcolor: 'background.paper',
        // borderRadius: 1,
        // boxShadow: 1,
      }}
    >
      {/* Toolbar */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          // bgcolor: 'grey.100',
          p: 1,
          // borderRadius: 1,
          mb: 2,
        }}
      >
      
        
        <DateSelect
          label="Fecha de medición"
          value={dateOfMeasurement}
          onDateChange={setDateOfMeasurement}
          // size="small"
        />
        <Button
          variant="outlined"
          // size="small"
          onClick={() => setShowImage((v) => !v)}
        >
          Ver
        </Button>
        <Button variant="outlined" >
          Ayuda
        </Button>
      </Box>

      {/* Inputs */}
      {dimensions.map((dimension) => {
        const m =
          measurements.find((x) => x.dimension_id === dimension.id_dimension) || {
            value: '',
            position: 'P',
          };
        return (
          <Box
            key={dimension.id_dimension}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              p: 1,
              borderRadius: 1,
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <Box flex={8} pr={1}>
              <TextField
                fullWidth
                label={dimension.name}
                type="number"
                size="small"
                value={m.value}
                onFocus={() => setSelectedDimension(dimension.id_dimension)}
                onChange={(e) => {
                  handleMeasurementChange(dimension.id_dimension, e.target.value);
                  setSelectedDimension(dimension.id_dimension);
                }}
              />
            </Box>
            <Box flex={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={m.position === 'P'}
                    onChange={() => {
                      handlePositionToggle(dimension.id_dimension);
                      setSelectedDimension(dimension.id_dimension);
                    }}
                  />
                }
                label={m.position === 'P' ? 'Parado' : 'Sentado'}
              />
            </Box>
          </Box>
        );
      })}
    </Box>

    {/* Right Column: image */}
    {showImage && selectedDimension && (
      <Box
        sx={{
          ml: 2,
          flex: '0 0 auto',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <AnnotatedImage
          src={`../${
            dimensions.find((d) => d.id_dimension === selectedDimension)?.name
          }.jpg`}
          width={250}
          measurements={[
            {
              xPct: 50,
              yPct: 50,
              label: `${
                measurements.find((m) => m.dimension_id === selectedDimension)
                  ?.value ?? ''
              } cm`,
            },
          ]}
        />
      </Box>
    )}
  </Box>
</TabPanel>
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
