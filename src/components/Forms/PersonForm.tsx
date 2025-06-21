/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton, InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import useNavigation from "../../hooks/useNavigation";
import { useNotify } from "../../hooks/useNotifications";
import { createPerson, getPerson, updatePerson } from "../../service/service";
import {
  Dimension,
  GroupedDimensions,
  Measurement,
  MetaType,
  Person,
  SelectedDim
} from "../../types";
import { AnnotatedImage } from "../AnnotatedImage";
import CountrySelect from "../CountrySelect";
import DateSelect from "../filtros/date";
// import helpDataDimenson from '@/../'
import { TabPanel } from "../../hooks/useTabPanel";
import helpDataDimension from "../../utils/helpDataDimension.json";

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  dimensions: GroupedDimensions[]; // Lista de dimensiones del grupo
  studyId: number;
  personId?: number; // ID de la persona (si se está editando)
  onRefresh: () => void;
}
// type MetaType = {
//   graphic: string[];
//   coords: { xPct: number; yPct: number };
//   // [key: string]: any; // Otros posibles campos
// };
// interface SelectedDim {
//   id: number;
//   name: string;
//   category: string;
//   graphic: string;
//   coords: { xPct: number; yPct: number };
// }
// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }
// function TabPanel({ children, value, index, ...props }: TabPanelProps) {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...props}
//     >
//       {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
//     </div>
//   );
// }

const PersonForm: React.FC<PersonFormProps> = ({
  open,
  onClose,
  mode,
  dimensions,
  studyId,
  personId,
  onRefresh,
}) => {
  const [identification, setIdentification] = useState("");
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
  // const [selectedDimension, setSelectedDimension] = useState<number | null>(
  //   null
  // );
  const [selectedDimension, setSelectedDimension] =
    useState<SelectedDim | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const notify = useNotify();
  const { goToPage } = useNavigation();
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };
  // Al inicio de PersonForm, tras los hooks:
  const groupedDimensions: GroupedDimensions[] = React.useMemo(() => {
    // Si dimensions ya fuera un array de grupos lo devolvemos directo
    if (Array.isArray(dimensions)) {
      return dimensions as GroupedDimensions[];
    }
    // Si dimensions es un objeto { [cat]: Dimension[] }
    return Object.entries(dimensions as Record<string, Dimension[]>).map(
      ([category, dims]) => ({ category, dimensions: dims })
    );
  }, [dimensions]);
  const handleSave = async () => {
    // Validaciones
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "El nombre es requerido";
    if (!gender) newErrors.gender = "El sexo es requerido";
    if (!dateOfBirth)
      newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
    if (!country) newErrors.country = "El país es requerido";
    // if (!state) newErrors.state = "El estado es requerido";
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
      identification,
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
      console.log("payload", payload);
      if (mode === "add") {
        await createPerson(payload);
        notify.success("Persona añadida con éxito");
      } else if (mode === "edit" && personId) {
        // PATCH en lugar de PUT para no borrar las mediciones faltantes
        await updatePerson(payload, personId);
        notify.success("Cambios realizados con éxito");
      }
      onRefresh();

      // onClose();
      handleClose();
    } catch (error) {
      console.error("Error al guardar la persona:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setName("");
    setIdentification("");
    setGender("");
    setCountry("");
    setState("");
    setProvince("");
    setDateOfBirth(null);
    setDateOfMeasurement(null);
    setMeasurements([]);
    setSelectedDimension(null);
    setErrors({});
  };
  const handleClose = () => {
    resetForm(); // Limpiar el formulario al cerrar
    onClose();
  };
  useEffect(() => {
    if (mode === "edit" && personId) {
      const fetchPerson = async () => {
        const fullPersonData = await getPerson(personId, studyId);
        setName(fullPersonData.name);
        setIdentification(fullPersonData.identification)
        setGender(fullPersonData.gender);
        setDateOfBirth(dayjs(fullPersonData.date_of_birth));
        setCountry(fullPersonData.country);
        setState(fullPersonData.state);
        setProvince(fullPersonData.province);
        console.log("person", fullPersonData);
        // setDateOfMeasurement(
        //   dayjs(fullPersonData.measurements?.dimensions?.[0]?.date ?? "")
        // );
        // 3) Extrae la fecha de la “primera” medición si existe:
        const firstCategory = Object.values(
          fullPersonData.measurements || {}
        )[0];
        const firstDate =
          Array.isArray(firstCategory) && firstCategory.length > 0
            ? firstCategory[0].date
            : undefined;
        setDateOfMeasurement(firstDate ? dayjs(firstDate) : null);
        const flat: Measurement[] = [];
        Object.entries(fullPersonData.measurements || {}).forEach(
          ([category, arr]) => {
            // Ensure arr is an array before calling forEach
            if (Array.isArray(arr)) {
              arr.forEach((m) =>
                flat.push({
                  dimension_id: m.id_dimension,
                  value: m.value,
                  position: m.position,
                  date: m.date,
                })
              );
            }
          }
        );
        setMeasurements(flat);
      };

      fetchPerson();
      setIsLoading(true);
    }
  }, [personId, dimensions, mode, studyId]);

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
      <Dialog open={open} onClose={handleClose} maxWidth="md">
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
                label="Id"
                fullWidth
                value={identification}
                type="number"
                onChange={(e) => setIdentification(e.target.value)}
                size="small"
                required
                error={!!errors.identification}
                helperText={errors.identification}
              />
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
            <Box
              display="flex"
              sx={{ mt: 0, minWidth: 550, maxHeight: 470, overflow: "hidden" }}
            >
              {/* Left Column */}
              <Box
                sx={{
                  flex: 1,
                  // maxHeight: 800,
                  overflowY: "auto",
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
                    sx={{ p: "6px", mt: "4px" }}
                    onClick={() => setShowImage((v) => !v)}
                  >
                    Ver
                  </Button>
                  {/* <Button variant="outlined">Ayuda</Button> */}
                </Box>

                {groupedDimensions.map((group, index) => (
                  <Accordion key={group.category}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body1">{group.category}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {group.dimensions.map((dimension) => {
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
                                        {dimension.name !== "Peso"
                                          ? "mm"
                                          : "kg"}
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                                onFocus={() => {
                                  type HelpCategory =
                                    keyof typeof helpDataDimension;
                                  const categoryKey: HelpCategory | undefined =
                                    (
                                      Object.keys(
                                        helpDataDimension
                                      ) as HelpCategory[]
                                    ).find(
                                      (key) =>
                                        key === group.category ||
                                        key === `${group.category}s`
                                    );

                                  if (!categoryKey) {
                                    console.warn(
                                      "No existe ayuda para categoría",
                                      group.category
                                    );
                                    return;
                                  }

                                  const items = helpDataDimension[categoryKey]
                                    .items as Record<string, unknown>;
                                  // Define el tipo para meta

                                  const meta = items[
                                    dimension.name!
                                  ] as MetaType;

                                  setSelectedDimension({
                                    id: dimension.id_dimension,
                                    name: dimension.name!,
                                    category: group.category,
                                    graphic: meta.graphic[0],
                                    coords: meta.coords,
                                  });
                                }}
                                onChange={(e) => {
                                  handleMeasurementChange(
                                    dimension.id_dimension,
                                    e.target.value
                                  );
                                  // Get the valid keys of helpDataDimension
                                  type HelpCategory =
                                    keyof typeof helpDataDimension;
                                  const categoryKey: HelpCategory | undefined =
                                    (
                                      Object.keys(
                                        helpDataDimension
                                      ) as HelpCategory[]
                                    ).find((key) => key === group.category);

                                  if (!categoryKey) {
                                    console.warn(
                                      "No existe ayuda para categoría",
                                      group.category
                                    );
                                    return;
                                  }

                                  const items = helpDataDimension[categoryKey]
                                    .items as Record<string, unknown>;
                                  const meta = items[
                                    dimension.name!
                                  ] as MetaType;

                                  setSelectedDimension({
                                    id: dimension.id_dimension,
                                    name: dimension.name!,
                                    category: group.category,
                                    graphic: meta.graphic[0],
                                    coords: meta.coords,
                                  });
                                }}
                              />
                            </Box>
                            <Box flex={4}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={m.position === "P"}
                                    onChange={() => {
                                      handlePositionToggle(
                                        dimension.id_dimension
                                      );
                                    }}
                                  />
                                }
                                label={
                                  m.position === "P" ? "Parado" : "Sentado"
                                }
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              {showImage && selectedDimension != null && (
                <Box
                  sx={{
                    ml: 2,
                    flex: "0 0 auto",
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                    position: "relative",
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // const allDims = groupedDimensions.flatMap(
                      //   (g) => g.dimensions
                      // );
                      // const dim = allDims.find(
                      //   (d) => d.id_dimension === selectedDimension
                      // );
                      // goToPage(`/help?item=${encodeURIComponent(dim.name)}`);
                      if (selectedDimension) {
                        goToPage(
                          `/help?category=${encodeURIComponent(selectedDimension.category)}&item=${encodeURIComponent(selectedDimension.name)}`,
                          undefined,
                          true
                        );
                      }
                    }}
                  >
                    <HelpOutlinedIcon fontSize="small" />
                  </IconButton>
                  <AnnotatedImage
                    src={`../imagenes_dimensiones/${selectedDimension.category}/${selectedDimension.id}-${selectedDimension.name}.jpg`}
                    // src={`../imagenes_dimensiones/${selectedDimension.graphic}`}
                    width={250}
                    measurements={[
                      {
                        xPct: selectedDimension.coords.xPct,
                        yPct: selectedDimension.coords.yPct,

                        label: `${measurements.find((m) => m.dimension_id === selectedDimension.id)?.value ?? ""} ${selectedDimension.name === "Peso" ? "kg" : "mm"}`,
                      },
                    ]}
                  />
                  {/* )
                    );
                  })()} */}
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
