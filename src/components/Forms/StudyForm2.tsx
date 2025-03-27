import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  Select,
  OutlinedInput,
  SelectChangeEvent,
  Checkbox,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { createStudy, getDimension } from "../../api/api";
import { Dimension, StudyData, StudyDimension } from "../../types";

interface StudyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  mode?: "add" | "edit";
  studyToEdit?: StudyData;
}

const POPULATION_AGE_RANGES = {
  L: { min: 0, max: 1 },
  T: { min: 1, max: 3 },
  E: { min: 4, max: 10 },
  A: { min: 11, max: 18 },
  AD: { min: 19, max: 59 },
  ADM: { min: 60, max: 120 },
};

const StudyForm: React.FC<StudyFormProps> = ({
  open,
  onClose,
  onSubmit,
  mode = "add",
  studyToEdit
}) => {
  const [formData, setFormData] = useState<StudyData>({
    name: "",
    classification: "",
    gender: "",
    country: "",
    location: "",
    description: "",
    size: null,
    age_min: 0,
    age_max: 100,
    start_date: dayjs(),
    end_date: dayjs().add(1, "month"),
    dimensions: [],
    ...studyToEdit
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allDimensions, setAllDimensions] = useState<Dimension[]>([]);

  const populationTypes = [
    { value: "L", label: "Lactante" },
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

  // Cargar dimensiones disponibles
  useEffect(() => {
    const loadDimensions = async () => {
      try {
        const dimensions = await getDimension();
        setAllDimensions(dimensions);
      } catch (error) {
        console.error("Error loading dimensions:", error);
      }
    };
    loadDimensions();
  }, []);

  // Actualizar rangos de edad cuando cambia la clasificación
  useEffect(() => {
    if (formData.classification) {
      const range = POPULATION_AGE_RANGES[
        formData.classification as keyof typeof POPULATION_AGE_RANGES
      ];
      setFormData(prev => ({
        ...prev,
        age_min: range.min,
        age_max: range.max,
      }));
    }
  }, [formData.classification]);

  const handleChange = (
    field: keyof StudyData
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = ["size", "age_min", "age_max"].includes(field)
      ? parseInt(event.target.value) || 0
      : event.target.value;
    
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (
    field: "start_date" | "end_date"
  ) => (date: Dayjs | null) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleAgeChange = (
    field: "age_min" | "age_max"
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    const range = POPULATION_AGE_RANGES[
      formData.classification as keyof typeof POPULATION_AGE_RANGES
    ];

    if (field === "age_min") {
      setFormData({
        ...formData,
        age_min: Math.min(value, formData.age_max),
        age_max: value > formData.age_max ? value : formData.age_max,
      });
    } else {
      setFormData({
        ...formData,
        age_max: Math.max(value, formData.age_min),
        age_min: value < formData.age_min ? value : formData.age_min,
      });
    }
  };

  const handleDimensionsChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    const selectedIds = typeof value === 'string' ? value.split(',').map(Number) : value;
    
    const selectedDimensions = selectedIds.map(id => {
      const existing = formData.dimensions.find(d => d.id_dimension === id);
      if (existing) return existing;
      
      const dimension = allDimensions.find(d => d.id_dimension === id);
      return {
        id_dimension: id,
        name: dimension?.name,
        initial: dimension?.initial
      };
    });

    setFormData({
      ...formData,
      dimensions: selectedDimensions
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        // start_date: formData.start_date?.format('YYYY-MM-DD'),
        // end_date: formData.end_date?.format('YYYY-MM-DD'),
        // No necesitamos enviar name e initial ya que el backend solo necesita id_dimension
        dimensions: formData.dimensions.map(({ id_dimension }) => ({ id_dimension }))
      };

      if (mode === "edit" && formData.id) {
        // await updateStudy(formData.id, payload);
      } else {
        console.log("play",payload)
        await createStudy(payload);
      }

      // onSubmit();
      onClose();
    } catch (error) {
      setError(`Error al ${mode === "edit" ? "editar" : "crear"} el estudio`);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener solo los IDs de las dimensiones seleccionadas para el Select
  const selectedDimensionIds = formData.dimensions.map(d => d.id_dimension);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "edit" ? "Editar Estudio" : "Crear Nuevo Estudio"}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre del estudio"
            fullWidth
            value={formData.name}
            onChange={handleChange("name")}
            size="small"
            required
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select
              label="Tipo de población"
              value={formData.classification}
              onChange={handleChange("classification")}
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

          {formData.classification && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Edad mínima"
                type="number"
                value={formData.age_min}
                onChange={handleAgeChange("age_min")}
                size="small"
                fullWidth
                inputProps={{
                  min: POPULATION_AGE_RANGES[
                    formData.classification as keyof typeof POPULATION_AGE_RANGES
                  ].min,
                  max: POPULATION_AGE_RANGES[
                    formData.classification as keyof typeof POPULATION_AGE_RANGES
                  ].max,
                }}
              />
              <TextField
                label="Edad máxima"
                type="number"
                value={formData.age_max}
                onChange={handleAgeChange("age_max")}
                size="small"
                fullWidth
                inputProps={{
                  min: POPULATION_AGE_RANGES[
                    formData.classification as keyof typeof POPULATION_AGE_RANGES
                  ].min,
                  max: POPULATION_AGE_RANGES[
                    formData.classification as keyof typeof POPULATION_AGE_RANGES
                  ].max,
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Tamaño de muestra"
              type="number"
              value={formData.size || ""}
              onChange={handleChange("size")}
              size="small"
              fullWidth
              inputProps={{ min: 1 }}
            />

            <TextField
              label="País"
              value={formData.country}
              onChange={handleChange("country")}
              size="small"
              fullWidth
              required
            />
          </Box>

          <TextField
            label="Locación"
            value={formData.location}
            onChange={handleChange("location")}
            size="small"
            fullWidth
            required
          />

          <FormControl fullWidth size="small">
            <InputLabel id="dimensions-label">Dimensiones</InputLabel>
            <Select
              labelId="dimensions-label"
              id="dimensions-select"
              multiple
              value={selectedDimensionIds}
              onChange={handleDimensionsChange}
              input={<OutlinedInput label="Dimensiones" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const dimension = allDimensions.find(d => d.id_dimension === id) || 
                                    formData.dimensions.find(d => d.id_dimension === id);
                    return (
                      <Chip
                        key={id}
                        label={dimension?.name || `ID: ${id}`}
                      />
                    );
                  })}
                </Box>
              )}

            >
              {allDimensions.map((dimension) => (
                <MenuItem
              
                  value={dimension.id_dimension}
                >
                  <Checkbox
                    checked={selectedDimensionIds.includes(dimension.id_dimension)}
                  />
                  <ListItemText 
                    primary={dimension.name} 
                    secondary={dimension.initial}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Fecha de inicio"
                value={formData.start_date as Dayjs}
                onChange={handleDateChange("start_date")}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <DatePicker
                label="Fecha de fin"
                value={formData.end_date as Dayjs}
                onChange={handleDateChange("end_date")}
                // minDate={formData.start_date}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>

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
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || !formData.name || !formData.classification}
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>

      {error && (
        <Typography color="error" sx={{ p: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}
    </Dialog>
  );
};


// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Box,
//   MenuItem,
//   Typography,
//   Chip,
//   Autocomplete,
//   Checkbox,
//   FormControl,
//   InputLabel,
//   ListItemText,
//   Select,
//   OutlinedInput,
//   SelectChangeEvent,
// } from "@mui/material";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs, { Dayjs } from "dayjs";
// import axios from "axios";
// import { createStudy, getData, getDimension } from "../../api/api";
// import { Dimension, StudyData } from "../../types";


// interface StudyFormProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: StudyData) => void;
//   // dimensions: Dimension[]; // List of available dimensions
//   mode?: "add" | "edit"; // Modo de operación
//   studyToEdit?: StudyData;
// }

// // Age ranges by population type
// const POPULATION_AGE_RANGES = {
//   L: { min: 0, max: 1 },
//   T: { min: 1, max: 3 },
//   E: { min: 4, max: 10 },
//   A: { min: 11, max: 18 },
//   AD: { min: 19, max: 59 },
//   ADM: { min: 60, max: 120 },
// };
// // const dimensions = [
// //   { id_dimension: 1, name: "Peso" },
// //   { id_dimension: 2, name: "Edad" },
// //   { id_dimension: 3, name: "Altura" },
// //   { id_dimension: 4, name: "Estatura" },
// // ];

// const StudyForm: React.FC<StudyFormProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   mode = "add",
//   studyToEdit
// }) => {
//   const [formData, setFormData] = useState<StudyData>({
//     name: studyToEdit?.name || "",
//     classification: studyToEdit?.classification || "",
//     gender: studyToEdit?.gender || "",
//     country: studyToEdit?.country || "",
//     location: studyToEdit?.location || "",
//     description: studyToEdit?.description || "",
//     size: studyToEdit?.size || null,
//     age_min: studyToEdit?.age_min || 0,
//     age_max: studyToEdit?.age_max || 100,
//     start_date: studyToEdit?.start_date
//       ? dayjs(studyToEdit.start_date)
//       : dayjs(),
//     end_date: studyToEdit?.end_date
//       ? dayjs(studyToEdit.end_date)
//       : dayjs().add(1, "month"),
//     // dimensions: studyToEdit?.dimensions?.map(d => d.id_dimension) || [],
//     dimensions: studyToEdit?.dimensions || [],
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [allDimensions, setAllDimensions] = useState<Dimension[] | null>(null);
//   const populationTypes = [
//     { value: "L", label: "Lactante" },
//     { value: "E", label: "Escolar" },
//     { value: "A", label: "Adolescente" },
//     { value: "AD", label: "Adulto" },
//     { value: "ADM", label: "Adulto Mayor" },
//   ];

//   const genderOptions = [
//     { value: "F", label: "Femenino" },
//     { value: "M", label: "Masculino" },
//     { value: "MF", label: "Mixto" },
//   ];

//   useEffect(() => {
//     if (formData.classification) {
//       const range =
//         POPULATION_AGE_RANGES[
//           formData.classification as keyof typeof POPULATION_AGE_RANGES
//         ];
//       setFormData((prev) => ({
//         ...prev,
//         age_min: range.min,
//         age_max: range.max,
//       }));
//     }
//   }, [formData.classification]);

//   useEffect(() => {
//     async function name() {
//       const dim=await getDimension()
//       setAllDimensions(dim)
//       console.log("dim",dim)
//     }
//     name()
//   }, []);

//   const handleChange =
//     (field: keyof StudyData) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const value =
//         field === "size" || field === "age_min" || field === "age_max"
//           ? parseInt(event.target.value) || 0
//           : event.target.value;

//       setFormData({ ...formData, [field]: value });
//     };

//   const handleDateChange =
//     (field: "start_date" | "end_date") => (date: Dayjs | null) => {
//       setFormData({ ...formData, [field]: date });
//     };

//   const handleAgeChange =
//     (field: "age_min" | "age_max") =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const value = parseInt(event.target.value) || 0;
//       const range =
//         POPULATION_AGE_RANGES[
//           formData.classification as keyof typeof POPULATION_AGE_RANGES
//         ];

//       if (field === "age_min") {
//         setFormData({
//           ...formData,
//           age_min: Math.min(value, formData.age_max),
//           age_max: value > formData.age_max ? value : formData.age_max,
//         });
//       } else {
//         setFormData({
//           ...formData,
//           age_max: Math.max(value, formData.age_min),
//           age_min: value < formData.age_min ? value : formData.age_min,
//         });
//       }
//     };

//   const handleDimensionsChange = (event: any) => {
    
//     const {
//       target: { value },
//     } = event;
//     setFormData({
//       ...formData,
//       dimensions: typeof value === 'string' ? value.split(',') : value,
//     });
//     // const { value } = event.target;
//     // // Convertimos los valores seleccionados a objetos { id_dimension }
//     // const selectedDimensions =
//     //   typeof value === "string"
//     //     ? value.split(",").map((id) => ({ id_dimension: Number(id) }))
//     //     : value.map((id) => ({ id_dimension: id }));

//     // setFormData({
//     //   ...formData,
//     //   dimensions: selectedDimensions,
//     // });
//   };

//   const handleSubmit = async () => {
//     alert("ok");
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       onSubmit(formData);
//       onClose();
//       // onSubmit(); // Notify parent component
//       onClose(); // Close the form
//     } catch (error) {
//       setError("Error al crear el estudio. Por favor intente nuevamente.");
//       console.error("Error creating study:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Crear Nuevo Estudio</DialogTitle>
//       <DialogContent>
//         <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
//           <TextField
//             label="Nombre del estudio"
//             fullWidth
//             value={formData.name}
//             onChange={handleChange("name")}
//             size="small"
//             required
//           />

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <TextField
//               select
//               label="Tipo de población"
//               value={formData.classification}
//               onChange={handleChange("classification")}
//               size="small"
//               fullWidth
//               required
//             >
//               {populationTypes.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>

//           {formData.classification && (
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Edad mínima"
//                 type="number"
//                 value={formData.age_min}
//                 onChange={handleAgeChange("age_min")}
//                 size="small"
//                 fullWidth
//                 required
//                 inputProps={{
//                   min: POPULATION_AGE_RANGES[
//                     formData.classification as keyof typeof POPULATION_AGE_RANGES
//                   ].min,
//                   max: POPULATION_AGE_RANGES[
//                     formData.classification as keyof typeof POPULATION_AGE_RANGES
//                   ].max,
//                 }}
//               />
//               <TextField
//                 label="Edad máxima"
//                 type="number"
//                 value={formData.age_max}
//                 onChange={handleAgeChange("age_max")}
//                 size="small"
//                 fullWidth
//                 required
//                 inputProps={{
//                   min: POPULATION_AGE_RANGES[
//                     formData.classification as keyof typeof POPULATION_AGE_RANGES
//                   ].min,
//                   max: POPULATION_AGE_RANGES[
//                     formData.classification as keyof typeof POPULATION_AGE_RANGES
//                   ].max,
//                 }}
//               />
//             </Box>
//           )}

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <TextField
//               select
//               label="Sexo"
//               value={formData.gender}
//               onChange={handleChange("gender")}
//               size="small"
//               fullWidth
//               required
//             >
//               {genderOptions.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               label="Tamaño de muestra"
//               type="number"
//               value={formData.size}
//               onChange={handleChange("size")}
//               size="small"
//               fullWidth
//               required
//               inputProps={{ min: 1 }}
//             />
//           </Box>

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <TextField
//               label="País"
//               value={formData.country}
//               onChange={handleChange("country")}
//               size="small"
//               fullWidth
//               required
//             />

//             <TextField
//               label="Locación"
//               value={formData.location}
//               onChange={handleChange("location")}
//               size="small"
//               fullWidth
//               required
//             />
//           </Box>

//           {/* <FormControl fullWidth size="small">
//             <InputLabel id="dimensions-label">Dimensiones</InputLabel>
//             <Select
//               labelId="dimensions-label"
//               id="dimensions-select"
//               multiple
//               value={formData.dimensions.map((d) => d.id_dimension)} // Extraemos solo los IDs para el value
//               onChange={handleDimensionsChange}
//               input={<OutlinedInput label="Dimensiones" />}
//               renderValue={(selected) => (
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                   {selected.map((id) => {
//                     const dimension = alldimensions?.find(
//                       (d) => d.id_dimension === id
//                     );
//                     return <Chip key={id} label={dimension?.name || id} />;
//                   })}
//                 </Box>
//               )}
//             >
//               {allDimensions?.map((dimension,index) => (
//                 <MenuItem
//                   key={index}
//                   value={dimension.id_dimension} // Pasamos solo el ID como value
//                 >
//                   <Checkbox
//                     checked={formData.dimensions.some(
//                       (d) => d.id_dimension === dimension.id_dimension
//                     )}
//                   />
//                   <ListItemText primary={`${dimension.name}`} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl> */}
          
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <DatePicker
//                 label="Fecha de inicio"
//                 value={formData.start_date}
//                 onChange={handleDateChange("start_date")}
//                 slotProps={{ textField: { size: "small", fullWidth: true } }}
//               />
//               <DatePicker
//                 label="Fecha de fin"
//                 value={formData.end_date}
//                 onChange={handleDateChange("end_date")}
//                 slotProps={{ textField: { size: "small", fullWidth: true } }}
//                 // minDate={formData.start_date}
//               />
//             </Box>
//           </LocalizationProvider>

//           <TextField
//             label="Descripción"
//             multiline
//             rows={4}
//             value={formData.description}
//             onChange={handleChange("description")}
//             fullWidth
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancelar</Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           // disabled={
//           //   !formData.classification ||
//           //   !formData.name ||
//           //   formData.dimensions.length === 0
//           // }
//         >
//           Guardar
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

export default StudyForm;
