import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// Definir el tipo de las props
interface SearchProps {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Definición del componente con TypeScript
const Search: React.FC<SearchProps> = ({ text ,onChange}) => {
  return (
<>
    <TextField
    id="search-input"
    label={text}
    variant="outlined"
    onChange={onChange}
    // fullWidth
    size="small"
    slotProps={{
      input: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton type="button" aria-label="search">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      },
    }}
    />
    </>
    // <Paper
    //   component="form"
    //   sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    // >
    // <>
    //   <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
    //     <SearchIcon />
    //   </IconButton>
    //   <TextField id="standard-basic" label={text}  variant="outlined"  onChange={onChange} />
    //   {/* <InputBase
        
    //     sx={{ ml: 1, flex: 1,  }}
    //     placeholder={text}
    //     inputProps={{ "aria-label": "search google maps" }}
    //     onChange={onChange} // Pasar la función onChange
    //   /> */}
    // // </>
    // </Paper>
    
  );
};

export default Search;
