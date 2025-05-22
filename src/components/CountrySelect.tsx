import React from 'react';
import {
  Autocomplete,
  Box,
  TextField,
//   AutocompleteProps,
} from '@mui/material';
import { countries } from '../utils/countries';

// Lista de países. Puedes importar esto desde otro archivo si lo prefieres.


interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
  label = 'País',
}) => {
return (
    <Autocomplete
        freeSolo
        autoHighlight
        options={countries.map((c) => c.label)}
        value={value}
        // margin="dense"
        onInputChange={(_, newValue) => onChange(newValue)}
        renderOption={(props, option) => {
            const country = countries.find((c) => c.label === option);
            return (
                <Box
                    component="li"
                    {...props}
                    sx={{ '& > img': { mr: 1, flexShrink: 0 } }}
                >
                    {country && (
                        <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                            alt=""
                        />
                    )}
                    {option}
                </Box>
            );
        }}
        renderInput={(params) => (
            <TextField
                {...params}
                label={label}
                size="small"
                margin="dense"
                fullWidth
                error={error}
                helperText={helperText}
            />
        )}
        // slotProps={{
        //     textField: {
        //         inputProps: {
        //             autoComplete: 'new-password', // desactiva autofill
        //         },
        //     },
        // }}
        sx={{ width: '100%' }}
    />
);
};

export default CountrySelect;


//   <Autocomplete
//                 freeSolo
//                 autoHighlight
//                 options={countries.map((c) => c.label)} // lista de etiquetas
//                 value={country}
//                 onInputChange={(_, value) => {
//                   setCountry(value);
//                   if (!value) setErrors({ country: "El país es obligatorio" });
//                   else setErrors({});
//                 }}
//                 renderOption={(props, option) => {
//                   const c = countries.find((c) => c.label === option)!;
//                   return (
//                     <Box
//                       component="li"
//                       {...props}
//                       sx={{ "& > img": { mr: 1, flexShrink: 0 } }}
//                     >
//                       <img
//                         loading="lazy"
//                         width="20"
//                         src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
//                         srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
//                         alt=""
//                       />
//                       {c.label}
//                     </Box>
//                   );
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="País"
//                     size="small"
//                     margin="dense"
//                     fullWidth
//                     error={!!errors.country}
//                     helperText={errors.country}
//                     inputProps={{
//                       ...params.inputProps,
//                       autoComplete: "new-password", // Deshabilita autofill
//                     }}
//                   />
//                 )}
//                 sx={{ width: "100%" }}
//               />