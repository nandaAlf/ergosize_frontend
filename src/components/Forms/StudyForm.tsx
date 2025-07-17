/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  Dimension,
  genderOptions,
  POPULATION_AGE_RANGES,
  populationTypes,
  StudyData,
  StudyPayload,
} from "../../types";

import {
  getAllDimensions,
  createStudy,
  updateStudy,
} from "../../service/service";
import { useNotify } from "../../hooks/useNotifications";
import CountrySelect from "../CountrySelect";

// const PopulationOption = React.memo(
//   ({ option }: { option: { value: string; label: string } }) => (
//     <MenuItem key={option.value} value={option.value}>
//       {option.label}
//     </MenuItem>
//   )
// );
// // Componente memoizado para opciones de género
// const GenderOption = React.memo(
//   ({ option }: { option: { value: string; label: string } }) => (
//     <MenuItem key={option.value} value={option.value}>
//       {option.label}
//     </MenuItem>
//   )
// );
interface StudyFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initialData?: StudyPayload | StudyData;
  onSuccess?: () => void; // Nueva prop
  study_size?: number;
}
interface FormErrors {
  name?: string;
  classification?: string;
  gender?: string;
  country?: string;
  location?: string;
  description?: string;
  size?: string;
  age_min?: string;
  age_max?: string;
  start_date?: string;
  end_date?: string;
  dimensions?: string;
}

// type Classification = "L" | "T" | "E" | "A" | "AD" | "ADM";
// type Gender = "F" | "M" | "MF";

// const POPULATION_AGE_RANGES = {
//   L: { min: 0, max: 1 },
//   T: { min: 1, max: 3 },
//   E: { min: 4, max: 10 },
//   A: { min: 11, max: 18 },
//   AD: { min: 19, max: 59 },
//   ADM: { min: 60, max: 120 },
// };

// const populationTypes = [
//   { value: "L", label: "Lactante" },
//   { value: "T", label: "Transicional" },
//   { value: "E", label: "Escolar" },
//   { value: "A", label: "Adolescente" },
//   { value: "AD", label: "Adulto" },
//   { value: "ADM", label: "Adulto Mayor" },
// ];

// const genderOptions = [
//   { value: "F", label: "Femenino" },
//   { value: "M", label: "Masculino" },
//   { value: "MF", label: "Mixto" },
// ];

// const StudyForm: React.FC<StudyFormProps> = ({
//   mode = "add",
//   onClose,
//   open = false,
//   onSuccess,
//   initialData,
// }) => {
//   const defaultValues = useMemo(
//     (): StudyPayload => ({
//       name: "",
//       classification: "",
//       gender: "MF",
//       country: "",
//       location: "",
//       description: "",
//       size: 0,
//       age_min: 0,
//       age_max: 120,
//       start_date: null,
//       end_date: null,
//       dimensions: [],
//     }),
//     []
//   );

//   const [formData, setFormData] = useState<StudyPayload>(defaultValues);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Partial<FormErrors>>({});
//   // Solo cargar dimensiones cuando el formulario se abre
//   const [shouldLoadDimensions, setShouldLoadDimensions] = useState(false);
//   const [availableDimensions, setAvailableDimensions] = useState<
//     GroupedDimensions[]
//   >([]);
//   const [selectedDimensionIds, setSelectedDimensionIds] = useState<number[]>(
//     []
//   );
//   const notify = useNotify();

//   useEffect(() => {
//     if (!open) return;
//     if (initialData && mode === "edit") {
//       // console.log("InitialDta",initialData)
//       setFormData({
//         ...initialData,
//         dimensions: [],
//         start_date: initialData.start_date
//           ? dayjs(initialData.start_date)
//           : null,
//         end_date: initialData.end_date ? dayjs(initialData.end_date) : null,
//       });
//       // Inicializar IDs de dimensiones seleccionadas
//       const ids = Object.values(initialData.dimensions || {})
//         .flat()
//         .map((d) => d.id_dimension);
//       setSelectedDimensionIds(ids);
//     } else {
//       setFormData(defaultValues);
//       setSelectedDimensionIds([]);
//     }
//     // Limpiar errores al abrir
//     setErrors({});
//   }, [initialData, open, mode, defaultValues]);
//   useEffect(() => {
//     if (open) {
//       setShouldLoadDimensions(true);
//     }
//   }, [open]);

//   useEffect(() => {
//     const loadDimensions = async () => {
//       const raw = await getAllDimensions();
//       // raw es un objeto, cambia siempre la referencia → dispara setState en cada render
//       const grouped = Object.entries(raw).map(([category, dims]) => ({
//         category,
//         dimensions: Array.isArray(dims) ? dims : [dims],
//       }));
//       setAvailableDimensions(grouped);
//     };
//     if (shouldLoadDimensions) loadDimensions();
//   }, [shouldLoadDimensions]); // Asegúrate de tener aquí el array vacío

//   const handleClassificationChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const classification = e.target.value as Classification;
//     const { min, max } = POPULATION_AGE_RANGES[classification];

//     setFormData((prev) => ({
//       ...prev,
//       classification,
//       age_min: min,
//       age_max: max,
//     }));
//   };

//   const handleAgeChange =
//     (field: "age_min" | "age_max") =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = parseInt(e.target.value) || 0;
//       if (formData.classification) {
//         const range = POPULATION_AGE_RANGES[formData.classification];

//         // Validar que el valor esté dentro del rango permitido
//         const clampedValue = Math.max(range.min, Math.min(range.max, value));

//         if (field === "age_min") {
//           setFormData((prev) => ({
//             ...prev,
//             age_min: clampedValue,
//             age_max: Math.max(clampedValue, prev.age_max),
//           }));
//         } else {
//           setFormData((prev) => ({
//             ...prev,
//             age_max: clampedValue,
//             age_min: Math.min(clampedValue, prev.age_min),
//           }));
//         }
//       }
//     };

//   const handleChange = useCallback(
//     (field: keyof StudyData) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = ["size"].includes(field)
//         ? parseInt(e.target.value) || null
//         : e.target.value;

//       setFormData((prev) => ({ ...prev, [field]: value }));
//     },
//     []
//   );

//   const handleDateChange = useCallback(
//     (field: "start_date" | "end_date") => (date: Dayjs | null) => {
//       setFormData((prev) => ({ ...prev, [field]: date }));
//     },
//     []
//   );

//   const validateForm = useCallback((): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name) newErrors.name = "Nombre es requerido";
//     if (!formData.classification)
//       newErrors.classification = "Tipo de población requerido";

//     if (formData.classification) {
//       const range = POPULATION_AGE_RANGES[formData.classification];

//       if (formData.age_min < range.min || formData.age_min > range.max) {
//         newErrors.age_min = `Edad mínima debe estar entre ${range.min} y ${range.max}`;
//       }

//       if (formData.age_max < range.min || formData.age_max > range.max) {
//         newErrors.age_max = `Edad máxima debe estar entre ${range.min} y ${range.max}`;
//       }
//     }

//     if (formData.age_min > formData.age_max) {
//       newErrors.age_min = "Edad mínima no puede ser mayor que la máxima";
//       newErrors.age_max = "Edad máxima no puede ser menor que la mínima";
//     }

//     if (formData.size === null || formData.size <= 0) {
//       newErrors.size = "Tamaño debe ser mayor que 0";
//     }

//     if (!formData.gender) {
//       newErrors.gender = "Género es requerido";
//     }
//     if (!formData.start_date) {
//       newErrors.start_date = "Fecha de inicio es requerida";
//     }

//     // if (!formData.end_date) {
//     //   newErrors.end_date = "Fecha de fin es requerida";
//     // }

//     if (
//       formData.start_date &&
//       formData.end_date &&
//       (formData.start_date as Dayjs).isAfter(formData.end_date)
//     ) {
//       newErrors.end_date = "Fecha de fin no puede ser anterior a la de inicio";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();

//       if (!validateForm()) return;

//       setIsLoading(true);

//       try {
//         const payload = {
//           ...formData,
//           start_date: formData.start_date
//             ? dayjs(formData.start_date).format("YYYY-MM-DD")
//             : null,
//           end_date: formData.end_date
//             ? dayjs(formData.end_date).format("YYYY-MM-DD")
//             : null,
//           study_dimension: selectedDimensionIds.map((id) => ({
//             id_dimension: id,
//           })),
//         };

//         if (mode === "add") {
//           await createStudy(payload);
//           notify.success("Estudio creado correctamente");
//         } else {
//           if (!payload.id) throw new Error("ID de estudio no definido");
//           await updateStudy(payload, payload.id);
//           notify.success("Estudio actualizado correctamente");
//         }

//         if (onSuccess) onSuccess();
//         // if (onSubmit) onSubmit(payload as StudyData);
//         onClose();
//       } catch (error) {
//         console.error(error);
//         notify.error(
//           mode === "add"
//             ? "Error al crear el estudio"
//             : "Error al actualizar el estudio"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [
//       formData,
//       selectedDimensionIds,
//       mode,
//       validateForm,
//       notify,
//       onSuccess,
//       onClose,
//     ]
//   );

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         {mode === "edit"
//           ? `Editar estudio: ${formData.name}  `
//           : "Crear nuevo estudio antropométrico"}
//       </DialogTitle>
//       <form onSubmit={handleSubmit}>
//         <DialogContent>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <TextField
//               label="Nombre del estudio"
//               fullWidth
//               value={formData.name}
//               onChange={handleChange("name")}
//               size="small"
//               required
//               error={!!errors.name}
//               helperText={errors.name}
//             />

//             <TextField
//               select
//               label="Tipo de población"
//               value={formData.classification}
//               onChange={handleClassificationChange}
//               size="small"
//               fullWidth
//               required
//               helperText={errors.classification}
//             >
//               {/* {renderPopulationOptions} */}
//               {populationTypes.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Edad mínima"
//                 type="number"
//                 value={formData.age_min}
//                 onChange={handleAgeChange("age_min")}
//                 size="small"
//                 fullWidth
//                 error={!!errors.age_min}
//                 helperText={errors.age_min}
//                 // inputProps={{
//                 //   min: POPULATION_AGE_RANGES[formData.classification].min,
//                 //   max: POPULATION_AGE_RANGES[formData.classification].max,
//                 // }}
//               />
//               <TextField
//                 label="Edad máxima"
//                 type="number"
//                 value={formData.age_max}
//                 onChange={handleAgeChange("age_max")}
//                 size="small"
//                 fullWidth
//                 error={!!errors.age_max}
//                 helperText={errors.age_max}
//                 // inputProps={{
//                 //   min: POPULATION_AGE_RANGES[formData.classification].min,
//                 //   max: POPULATION_AGE_RANGES[formData.classification].max,
//                 // }}
//               />
//             </Box>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Tamaño de muestra"
//                 type="number"
//                 value={formData.size || ""}
//                 onChange={handleChange("size")}
//                 size="small"
//                 fullWidth
//                 error={!!errors.size}
//                 helperText={errors.size}
//                 inputProps={{ min: 1 }}
//               />
//               <TextField
//                 select
//                 label="Sexo"
//                 value={formData.gender}
//                 onChange={handleChange("gender")}
//                 size="small"
//                 fullWidth
//                 required
//                 helperText={errors.gender}
//               >
//                 {genderOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//                 {/* {renderGenderOptions} */}
//               </TextField>
//             </Box>

//             <Box sx={{ display: "flex", gap: 2 }}>
//               <CountrySelect
//                 value={formData.country}
//                 onChange={(value: string) =>
//                   setFormData((prev) => ({ ...prev, country: value }))
//                 }
//                 error={!!errors.country}
//                 helperText={errors.country}
//               />

//               <TextField
//                 label="Locación"
//                 margin="dense"
//                 value={formData.location}
//                 onChange={handleChange("location")}
//                 size="small"
//                 fullWidth
//                 required
//               />
//             </Box>

//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <Box sx={{ display: "flex", gap: 2 }}>
//                 <DatePicker
//                   label="Fecha de inicio"
//                   value={formData.start_date as Dayjs}
//                   onChange={handleDateChange("start_date")}
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       fullWidth: true,
//                       error: !!errors.start_date,
//                       helperText: errors.start_date,
//                     },
//                   }}
//                 />
//                 <DatePicker
//                   label="Fecha de fin"
//                   value={formData.end_date as Dayjs}
//                   onChange={handleDateChange("end_date")}
//                   minDate={formData.start_date as Dayjs}
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       fullWidth: true,
//                       error: !!errors.end_date,
//                       helperText: errors.end_date,
//                     },
//                   }}
//                 />
//               </Box>
//             </LocalizationProvider>
//             <FormControl fullWidth size="small">
//               <InputLabel>Dimensiones a medir</InputLabel>
//               <Select
//                 multiple
//                 value={selectedDimensionIds}
//                 onChange={(e) => {
//                   const value = e.target.value as number[];
//                   setSelectedDimensionIds(value);
//                 }}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                     {selected.map((id) => {
//                       const d = availableDimensions
//                         .flatMap((g) => g.dimensions)
//                         .find((x) => x.id_dimension === id);
//                       return (
//                         <Chip
//                           key={id}
//                           label={d ? `${d.name} (${d.initial})` : id}
//                           size="small"
//                         />
//                       );
//                     })}
//                   </Box>
//                 )}
//               >
//                 {availableDimensions.map((group) => [
//                   <ListSubheader key={group.category}>
//                     {group.category}
//                   </ListSubheader>,
//                   group.dimensions.map((dim) => (
//                     <MenuItem key={dim.id_dimension} value={dim.id_dimension}>
//                       <Checkbox
//                         checked={selectedDimensionIds.includes(
//                           dim.id_dimension
//                         )}
//                       />
//                       <ListItemText primary={`${dim.name} (${dim.initial})`} />
//                     </MenuItem>
//                   )),
//                 ])}
//               </Select>
//             </FormControl>
//             <TextField
//               label="Descripción"
//               multiline
//               rows={4}
//               value={formData.description}
//               onChange={handleChange("description")}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Cancelar</Button>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             onClick={handleSubmit}
//           >
//             {mode === "edit" ? "Actualizar" : "Guardar"}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// export default StudyForm;

const StudyForm: React.FC<StudyFormProps> = ({
  mode = "add",
  onClose,
  open = false,
  onSuccess,
  initialData,
}) => {
  // Hooks y estados
  const [formData, setFormData] = useState<StudyPayload>(getDefaultValues());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [availableDimensions, setAvailableDimensions] = useState<
    { category: string; dimensions: Dimension[] }[]
  >([]);
  const [selectedDimensionIds, setSelectedDimensionIds] = useState<number[]>(
    []
  );
  const notify = useNotify();

  // Efectos
  useEffect(() => initializeForm(), [open, mode, initialData]);
  useEffect(() => {
    const fetchDimensions = async () => {
      await loadDimensionsIfNeeded();
    };
    fetchDimensions();
  }, [open]);

  // Funciones principales
  const initializeForm = () => {
    if (!open) return;

    if (initialData && mode === "edit") {
      setFormData({
        ...initialData,
        dimensions: [],
        start_date: initialData.start_date
          ? dayjs(initialData.start_date)
          : null,
        end_date: initialData.end_date ? dayjs(initialData.end_date) : null,
      });
      setSelectedDimensionIds(
        Object.values(initialData.dimensions || {})
          .flat()
          .map((d) => d.id_dimension)
      );

      Object.values(initialData.dimensions || {})
        .flat()
        .map((d) => console.log("ddd ", d));
    } else {
      setFormData(getDefaultValues());
      setSelectedDimensionIds([]);
    }
    setErrors({});
  };

  const loadDimensionsIfNeeded = async () => {
    if (!open) return;

    const raw = await getAllDimensions();
    const grouped = Object.entries(raw).map(([category, dims]) => ({
      category,
      dimensions: Array.isArray(dims) ? dims as Dimension[] : [dims as Dimension],
    }));
    setAvailableDimensions(grouped);
  };

  // Handlers
  const handleClassificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const classification = e.target.value as keyof typeof POPULATION_AGE_RANGES;
    const { min, max } = POPULATION_AGE_RANGES[classification];

    setFormData((prev) => ({
      ...prev,
      classification,
      age_min: min,
      age_max: max,
    }));
  };

  const handleAgeChange =
    (field: "age_min" | "age_max") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      if (!formData.classification) return;

      const range = POPULATION_AGE_RANGES[formData.classification];
      const clampedValue = Math.max(range.min, Math.min(range.max, value));

      setFormData((prev) => ({
        ...prev,
        [field]: clampedValue,
        ...(field === "age_min"
          ? { age_max: Math.max(clampedValue, prev.age_max) }
          : { age_min: Math.min(clampedValue, prev.age_min) }),
      }));
    };

  const handleChange =
    (field: keyof StudyData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = ["size"].includes(field)
        ? parseInt(e.target.value) || null
        : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleDateChange =
    (field: "start_date" | "end_date") => (date: Dayjs | null) => {
      setFormData((prev) => ({ ...prev, [field]: date }));
    };
  const handleDimensionChange = (e: SelectChangeEvent<number[]>) => {
    const value = e.target.value;
    // MUI's Select with multiple returns value as string[] by default, so we need to convert to number[]
    const ids =
      typeof value === "string"
        ? value.split(",").map(Number)
        : (value as number[]);
    setSelectedDimensionIds(ids);
  };

  // Validación y envío
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = "Nombre es requerido";
    if (!formData.classification)
      newErrors.classification = "Tipo de población requerido";

    if (formData.classification) {
      const range = POPULATION_AGE_RANGES[formData.classification];

      if (formData.age_min < range.min || formData.age_min > range.max) {
        newErrors.age_min = `Edad mínima debe estar entre ${range.min} y ${range.max}`;
      }

      if (formData.age_max < range.min || formData.age_max > range.max) {
        newErrors.age_max = `Edad máxima debe estar entre ${range.min} y ${range.max}`;
      }
    }

    if (formData.age_min > formData.age_max) {
      newErrors.age_min = "Edad mínima no puede ser mayor que la máxima";
      newErrors.age_max = "Edad máxima no puede ser menor que la mínima";
    }

    if (formData.size === null || formData.size <= 0) {
      newErrors.size = "Tamaño debe ser mayor que 0";
    }

    if (!formData.gender) newErrors.gender = "Género es requerido";
    if (!formData.start_date)
      newErrors.start_date = "Fecha de inicio es requerida";

    if (
      formData.start_date &&
      formData.end_date &&
      dayjs(formData.start_date).isAfter(dayjs(formData.end_date))
    ) {
      newErrors.end_date = "Fecha de fin no puede ser anterior a la de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        start_date: formData.start_date
          ? dayjs(formData.start_date).format("YYYY-MM-DD")
          : null,
        end_date: formData.end_date
          ? dayjs(formData.end_date).format("YYYY-MM-DD")
          : null,
        study_dimension: selectedDimensionIds.map((id) => ({
          id_dimension: id,
        })),
      };

      if (mode === "add") {
        await createStudy(payload);
        notify.success("Estudio creado correctamente");
      } else {
        if (!payload.id) throw new Error("ID de estudio no definido");
        await updateStudy(payload, payload.id);
        notify.success("Estudio actualizado correctamente");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      notify.error(
        mode === "add"
          ? "Error al crear el estudio"
          : "Error al actualizar el estudio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render helpers
  const renderPopulationOptions = populationTypes.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));

  const renderGenderOptions = genderOptions.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));

  const renderSelectedDimensions = (selected: number[]) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {selected.map((id) => {
        const dimension = availableDimensions
          .flatMap((g) => g.dimensions)
          .find((d) => d.id_dimension === id);
        return (
          <Chip
            key={id}
            label={dimension ? `${dimension.name} (${dimension.initial})` : id}
            size="small"
          />
        );
      })}
    </Box>
  );

  const renderDimensionOptions = availableDimensions.map((group) => [
    <ListSubheader key={group.category}>{group.category}</ListSubheader>,
    group.dimensions.map((dim) => (
      <MenuItem key={dim.id_dimension} value={dim.id_dimension}>
        <Checkbox checked={selectedDimensionIds.includes(dim.id_dimension)} />
        <ListItemText primary={`${dim.name} (${dim.initial})`} />
      </MenuItem>
    )),
  ]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "edit"
          ? `Editar estudio: ${formData.name}`
          : "Crear nuevo estudio antropométrico"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nombre del estudio"
              fullWidth
              value={formData.name}
              onChange={handleChange("name")}
              size="small"
              required
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              select
              label="Tipo de población"
              value={formData.classification}
              onChange={handleClassificationChange}
              size="small"
              fullWidth
              required
              helperText={errors.classification}
            >
              {renderPopulationOptions}
            </TextField>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Edad mínima"
                type="number"
                value={formData.age_min}
                onChange={handleAgeChange("age_min")}
                size="small"
                fullWidth
                error={!!errors.age_min}
                helperText={errors.age_min}
              />
              <TextField
                label="Edad máxima"
                type="number"
                value={formData.age_max}
                onChange={handleAgeChange("age_max")}
                size="small"
                fullWidth
                error={!!errors.age_max}
                helperText={errors.age_max}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Tamaño de muestra"
                type="number"
                value={formData.size || ""}
                onChange={handleChange("size")}
                size="small"
                fullWidth
                error={!!errors.size}
                helperText={errors.size}
                inputProps={{ min: 1 }}
              />
              <TextField
                select
                label="Sexo"
                value={formData.gender}
                onChange={handleChange("gender")}
                size="small"
                fullWidth
                required
                helperText={errors.gender}
              >
                {renderGenderOptions}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <CountrySelect
                value={formData.country}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }
                error={!!errors.country}
                helperText={errors.country}
              />

              <TextField
                label="Locación"
                margin="dense"
                value={formData.location}
                onChange={handleChange("location")}
                size="small"
                fullWidth
                required
              />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Fecha de inicio"
                  value={formData.start_date as Dayjs}
                  onChange={handleDateChange("start_date")}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!errors.start_date,
                      helperText: errors.start_date,
                    },
                  }}
                />
                <DatePicker
                  label="Fecha de fin"
                  value={formData.end_date as Dayjs}
                  onChange={handleDateChange("end_date")}
                  minDate={formData.start_date as Dayjs}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!errors.end_date,
                      helperText: errors.end_date,
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>

            <FormControl fullWidth size="small">
              <InputLabel>Dimensiones a medir</InputLabel>
              <Select
                multiple
                value={selectedDimensionIds}
                onChange={handleDimensionChange}
                renderValue={renderSelectedDimensions}
              >
                {renderDimensionOptions}
              </Select>
            </FormControl>

            <TextField
              label="Descripción"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Helper functions
function getDefaultValues(): StudyPayload {
  return {
    name: "",
    classification: "",
    gender: "MF",
    country: "",
    location: "",
    description: "",
    size: 0,
    age_min: 0,
    age_max: 120,
    start_date: null,
    end_date: null,
    dimensions: [],
  };
}

export default React.memo(StudyForm);
