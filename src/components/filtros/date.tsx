import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel/InputLabel";

// Props: ahora onDateChange recibe Dayjs|null
interface DateSelectProps {
  value: Dayjs | null;
  onDateChange: (value: Dayjs | null) => void;
  label:string;
}

const DateSelect: React.FC<DateSelectProps> = ({ value, onDateChange , label}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    
    <DatePicker
      label={label}
      value={value}
      onChange={(newValue) => {
        onDateChange(newValue);
      }}
      format="DD/MM/YYYY"
    />
  </LocalizationProvider>
);

export default DateSelect;
