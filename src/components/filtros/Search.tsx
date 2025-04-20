import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// Definir el tipo de las props
interface SearchProps {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

// Definición del componente con TypeScript
const Search: React.FC<SearchProps> = ({ text, onChange, value }) => {
  return (
    <Box >
      <TextField
        sx={{
          borderRadius: "999px", // súper redondeado
          '& .MuiOutlinedInput-root': {
            borderRadius: "999px", // borde del input
            paddingRight: 0,
          },
          '& .MuiOutlinedInput-input': {
            padding: '8px 14px', // ajusta esto según te guste
          },
          backgroundColor: "#fff",
        }}
        id="search-input"
        // label={text}
        placeholder={text + " ..."}
        //  variant="inlined"
        onChange={onChange}
        value={value}
        fullWidth
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton type="button" aria-label="search">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default Search;
