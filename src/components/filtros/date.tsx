import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DateSelectProps {
  value: Dayjs | null;
  onDateChange: (value: Dayjs | null) => void;
  label: string;
  size?: 'small' | 'medium';
}

const DateSelect: React.FC<DateSelectProps> = ({ value, onDateChange, label, size='small' }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label={label}
      value={value}
      onChange={(newValue) => onDateChange(newValue)}
      format="DD/MM/YYYY"
      slotProps={{
        textField: {
          size: size,
          margin: "dense",
          fullWidth: true,
        },
      }}
    />
  </LocalizationProvider>
);

export default DateSelect;
