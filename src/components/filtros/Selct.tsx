import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectProps {
  text: string;
  onChange: (value: string) => void;
}

const SelectFilter: React.FC<SelectProps> = ({ text, onChange }) => {
  const [sex, setSex] = React.useState(""); // Valor por defecto: "mixto"

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSex(value);
    onChange(value); // Notificar al componente padre
  };

  return (
    <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 } }  size="small">
      <InputLabel id="sex-select-label">{text}</InputLabel>
      <Select
        labelId="sex-select-label"
        id="sex-select"
        value={sex}
        label={text}
        onChange={handleChange}
      >
        <MenuItem value="">Mixto</MenuItem>
        <MenuItem value="M">Masculino</MenuItem>
        <MenuItem value="F">Femenino</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectFilter;