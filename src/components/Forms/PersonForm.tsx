/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
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
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Dimension, Person } from "../../types";
import axios from "axios";
import Grid from "@mui/material/Grid";
import DateSelect from "../filtros/date";
import dayjs, { Dayjs } from "dayjs";
import { AnnotatedImage } from "../AnnotatedImage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { createPerson, getPerson, updatePerson } from "../../service/service";
import { countries } from "../../utils/countries";
import CountrySelect from "../CountrySelect";
import { useNotify } from "../../hooks/useNotifications";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import useNavigation from "../../hooks/useNavigation";
interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  dimensions: Dimension[]; // Lista de dimensiones del grupo
  studyId: number;
  personId?: number; // ID de la persona (si se está editando)
  onRefresh: () => void;
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
  onRefresh,
}) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("");
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
  const notify = useNotify();
  const { goToPage } = useNavigation();
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

    const payload: Person = {
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
        createPerson(payload);
        notify.success("Persona añadida con éxito");
      } else if (mode === "edit" && personId) {
        // PATCH en lugar de PUT para no borrar las mediciones faltantes
        updatePerson(payload, personId);
        notify.success("Cambios realizados con éxito");
      }
      onRefresh();

      onClose();
    } catch (error) {
      console.error("Error al guardar la persona:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && personId) {
      const fetchPerson = async () => {
        const fullPersonData = await getPerson(personId);
        setName(fullPersonData.name);
        setGender(fullPersonData.gender);
        setDateOfBirth(dayjs(fullPersonData.date_of_birth));
        setCountry(fullPersonData.country);
        setState(fullPersonData.state);
        setProvince(fullPersonData.province);
        setDateOfMeasurement(
          dayjs(fullPersonData.measurements?.[0]?.date ?? "")
        );
        // console.log(response.data);
        const initialMeasurements: Measurement[] = (
          fullPersonData.measurements ?? []
        ).map((m: Measurement) => ({
          dimension_id: m.dimension_id,
          value: m.value,
          position: m.position, // "P" o "S"
          date: m.date.split("T")[0], // "YYYY-MM-DD"
        }));
        setMeasurements(initialMeasurements);
      };

      fetchPerson();

      setIsLoading(true);
    }
  }, [personId, dimensions, mode]);

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
      <Dialog open={open} onClose={onClose} maxWidth="md">
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
            <Box maxWidth={500}>
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
                  margin="dense"
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
                <p
                  style={{ color: "red", fontSize: "13px", marginLeft: "12px" }}
                >
                  {errors.dateOfBirth}
                </p>
              )}

              <CountrySelect
                value={country}
                onChange={(value) => {
                  setCountry(value);
                  // if (!value) setErrors({ country: "El país es obligatorio" });
                  // else setErrors({});
                }}
                // onChange={(e) => setCountry(e.target.value)}
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
            </Box>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Box display="flex"  sx={{ mt: 0, minWidth:500 }}>
              {/* Left Column */}
              <Box
                sx={{
                  flex: 1,
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
                  {errors.dateOfMeasurement && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "13px",
                        marginLeft: "12px",
                      }}
                    >
                      {errors.dateOfMeasurement}
                    </p>
                  )}
                  <Button
                    variant="outlined"
                    // size="small"
                    // margin="dense"
                    sx={{ p:"6px", mt:"4px" }}
                    onClick={() => setShowImage((v) => !v)}
                  >
                    Ver
                  </Button>
                  {/* <Button variant="outlined">Ayuda</Button> */}
                </Box>

                {/* Inputs */}
                {dimensions.map((dimension) => {
                  const m = measurements.find(
                    (x) => x.dimension_id === dimension.id_dimension
                  ) || {
                    value: "",
                    position: "P",
                  };
                  return (
                    <Box
                      key={dimension.id_dimension}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        "&:hover": { bgcolor: "grey.50" },
                      }}
                    >
                      <Box flex={8} pr={1}>
                        <TextField
                          fullWidth
                          label={dimension.name}
                          type="number"
                          size="small"
                          value={m.value}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="start">
                                  {dimension.name != "Peso" ? "mm" : "kg"}
                                </InputAdornment>
                              ),
                            },
                          }}
                          onFocus={() =>
                            setSelectedDimension(dimension.id_dimension)
                          }
                          onChange={(e) => {
                            handleMeasurementChange(
                              dimension.id_dimension,
                              e.target.value
                            );
                            setSelectedDimension(dimension.id_dimension);
                          }}
                        />
                      </Box>
                      <Box flex={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={m.position === "P"}
                              onChange={() => {
                                handlePositionToggle(dimension.id_dimension);
                                setSelectedDimension(dimension.id_dimension);
                              }}
                            />
                          }
                          label={m.position === "P" ? "Parado" : "Sentado"}
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
                    flex: "0 0 auto",
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                    position: "relative", // Añadido para posicionamiento relativo
                  }}
                >
                  {/* <Box>Helpp</?Box> */}
                  {/* <IconButton sx={{zIndex:2}}>f</IconButton> */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Lógica para mostrar ayuda
                      e.stopPropagation();
                      const dimension = dimensions.find(
                        (d) => d.id_dimension === selectedDimension
                      );
                      if (dimension) {
                        goToPage(
                          `/help?item=${encodeURIComponent(dimension.name)}`
                        );
                      }
                    }}
                  >
                    {/* HelpOutlinedIcon */}
                    <HelpOutlinedIcon fontSize="small" />
                  </IconButton>
                  <AnnotatedImage
                    src={`../${
                      dimensions.find(
                        (d) => d.id_dimension === selectedDimension
                      )?.name
                    }.jpg`}
                    width={250}
                    measurements={[
                      {
                        xPct: 50,
                        yPct: 50,
                        label: `${
                          measurements.find(
                            (m) => m.dimension_id === selectedDimension
                          )?.value ?? ""
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
