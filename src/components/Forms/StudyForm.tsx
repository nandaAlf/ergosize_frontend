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
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Dimension, StudyData } from "../../types";
import { getDimension } from "../../api/api";

// interface StudyData {
//   id?: number;
//   name: string;
//   classification: Classification;
//   gender: Gender;
//   country: string;
//   location: string;
//   description: string;
//   size: number | null;
//   age_min: number;
//   age_max: number;
//   start_date: Dayjs | null;
//   end_date: Dayjs | null;
//   dimensions: any[]; // Ajusta este tipo según tu necesidad
// }

interface StudyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudyData) => void;
  mode?: "add" | "edit";
  initialData?: StudyData;
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

type Classification = "L" | "T" | "E" | "A" | "AD" | "ADM";
type Gender = "F" | "M" | "MF";

const POPULATION_AGE_RANGES = {
  L: { min: 0, max: 1 },
  T: { min: 1, max: 3 },
  E: { min: 4, max: 10 },
  A: { min: 11, max: 18 },
  AD: { min: 19, max: 59 },
  ADM: { min: 60, max: 120 },
};

const populationTypes = [
  { value: "L", label: "Lactante" },
  { value: "T", label: "Transicional" },
  { value: "E", label: "Escolar" },
  { value: "A", label: "Adolescente" },
  { value: "AD", label: "Adulto" },
  { value: "ADM", label: "Adulto Mayor" },
];

const genderOptions = [
  { value: "F", label: "Femenino" },
  { value: "M", label: "Masculino" },
  { value: "MF", label: "Mixto" },
];

const StudyForm: React.FC<StudyFormProps> = ({
  mode = "add",
  onClose,
  open,
  onSubmit,
  initialData,
}) => {
  const defaultValues: StudyData = {
    name: "",
    classification: "",
    gender: "",
    country: "",
    location: "",
    description: "",
    size: null,
    age_min: 0,
    age_max: 120,
    start_date: null,
    end_date: null,
    dimensions: [],
  };

  const [formData, setFormData] = useState<StudyData>(defaultValues);
  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [availableDimensions, setAvailableDimensions] = useState<Dimension[]>(
    []
  );
  const [selectedDimensionIds, setSelectedDimensionIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      // console.log("InitialDta",initialData)
      setFormData({
        ...initialData,
        dimensions: [],
        start_date: initialData.start_date
          ? dayjs(initialData.start_date)
          : null,
        end_date: initialData.end_date ? dayjs(initialData.end_date) : null,
      });
    } else {
      setFormData(defaultValues);
    }
  }, [initialData, open, mode]);
  // Cargar dimensiones disponibles
  useEffect(() => {
    const loadDimensions = async () => {
      try {
        const dimensionsFromApi = await getDimension();
      
        // Mapear de {id, name, initial} a {id_dimension, name, initial}
        // const mappedDimensions = dimensionsFromApi?.map(dim => ({
        //   id_dimension: dim.id,
        //   name: dim.name,
        //   initial: dim.initial
        // }));
        
        setAvailableDimensions(dimensionsFromApi);
      } catch (error) {
        console.error("Error loading dimensions:", error);
      }
    };
    loadDimensions();
  }, []);
  // useEffect(() => {
  //   console.log(allDimensions);
  // }, [allDimensions]);
  // Cargar dimensiones seleccionadas cuando hay initialData
  useEffect(() => {
    if (initialData && mode === "edit") {
      setSelectedDimensionIds(
        initialData.dimensions.map((d) => d.id_dimension)
      );
    } else {
      setSelectedDimensionIds([]);
    }
  }, [initialData, mode]);

  const handleClassificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const classification = e.target.value as Classification;
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
      if (formData.classification) {
        const range = POPULATION_AGE_RANGES[formData.classification];

        // Validar que el valor esté dentro del rango permitido
        const clampedValue = Math.max(range.min, Math.min(range.max, value));

        if (field === "age_min") {
          setFormData((prev) => ({
            ...prev,
            age_min: clampedValue,
            age_max: Math.max(clampedValue, prev.age_max),
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            age_max: clampedValue,
            age_min: Math.min(clampedValue, prev.age_min),
          }));
        }
      }
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (formData.classification) {
      const range = POPULATION_AGE_RANGES[formData.classification];
      if (formData.age_min < range.min || formData.age_min > range.max) {
        newErrors.age_min = `Edad mínima debe estar entre ${range.min} y ${range.max}`;
      }

      if (formData.age_max < range.min || formData.age_max > range.max) {
        newErrors.age_max = `Edad máxima debe estar entre ${range.min} y ${range.max}`;
      }
    } else newErrors.classification = "Tipo de población requerido";
    // Validación de campos requeridos
    if (!formData.name) newErrors.name = "Nombre es requerido";

    // Validación de tamaño
    if (formData.size === null || formData.size <= 0) {
      newErrors.size = "Tamaño debe ser mayor que 0";
    }

    // Validación de rangos de edad

    if (formData.age_min > formData.age_max) {
      newErrors.age_min = "Edad mínima no puede ser mayor que la máxima";
      newErrors.age_max = "Edad máxima no puede ser menor que la mínima";
    }

    // Validación de fechas
    if (!formData.start_date) {
      newErrors.start_date = "Fecha de inicio es requerida";
    }

    if (!formData.end_date) {
      newErrors.end_date = "Fecha de fin es requerida";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      (formData.start_date as Dayjs).isAfter(formData.end_date)
    ) {
      newErrors.end_date = "Fecha de fin no puede ser anterior a la de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      start_date: formData.start_date 
        ? dayjs(formData.start_date).format('YYYY-MM-DD') 
        : null,
      end_date: formData.end_date 
        ? dayjs(formData.end_date).format('YYYY-MM-DD') 
        : null,
      dimensions: selectedDimensionIds.map(id => ({ id_dimension: id })),
    };
    if (validateForm()) {
      console.log("enviando", dataToSubmit);
      // onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "edit" ? "Editar Estudio" : "Crear Nuevo Estudio"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
            >
              {populationTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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
                // inputProps={{
                //   min: POPULATION_AGE_RANGES[formData.classification].min,
                //   max: POPULATION_AGE_RANGES[formData.classification].max,
                // }}
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
                // inputProps={{
                //   min: POPULATION_AGE_RANGES[formData.classification].min,
                //   max: POPULATION_AGE_RANGES[formData.classification].max,
                // }}
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
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="País"
                value={formData.country}
                onChange={handleChange("country")}
                size="small"
                fullWidth
                required
              />
              <TextField
                label="Locación"
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
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>Dimensiones a medir</InputLabel>
              <Select
                multiple
                value={selectedDimensionIds}
                onChange={(e) => {
                  const value = e.target.value;
                  const selectedIds =
                    // typeof value[0] === "string"
                    //   ? (value as string[]).map(Number)
                    //   :
                       (value as number[]);
                  setSelectedDimensionIds(selectedIds);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const dimension = availableDimensions.find(
                        (d) => d.id_dimension === id
                      );
                      return (
                        <Chip
                          key={`selected-dim-${id}`} // Key única añadida aquí
                          label={
                            dimension
                              ? `${dimension.name} (${dimension.initial})`
                              : id
                          }
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableDimensions?.map((dimension) => (
                  <MenuItem
                    key={`dim-${dimension.id_dimension}`} // Key única añadida aquí
                    value={dimension.id_dimension}
                  >
                    <Checkbox
                      checked={selectedDimensionIds.includes(
                        dimension.id_dimension
                      )}
                    />
                    <ListItemText
                      primary={`${dimension.name} (${dimension.initial})`}
                    />
                  </MenuItem>
                ))}
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
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudyForm;
