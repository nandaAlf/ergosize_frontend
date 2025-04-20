import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectFilterProps {
  text: string; // Texto del label
  value: string; // Valor seleccionado
  onChange: (value: string) => void; // Función para manejar cambios
  items: { value: string; label: string }[]; // Lista de opciones
  sizeProp?:"small"| "medium"
}

const SelectFilter: React.FC<SelectFilterProps> = ({ text, value, onChange, items, sizeProp="small" }) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;
    onChange(selectedValue); // Notificar al componente padre
  };

  return (
    // <FormControl variant="outlined" sx={{ m: 1, minWidth: 120, backgroundColor: "#fff", color: "black" }} >
    <>
      <InputLabel id="select-label">{text}</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={value}
        label={text}
        onChange={handleChange}
        // size={sizeProp}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
        </>
  );
};

export default SelectFilter;