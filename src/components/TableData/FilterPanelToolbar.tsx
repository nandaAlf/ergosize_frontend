// EnhancedTableToolbar.tsx
import * as React from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  alpha,
  Box,
  Stack,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add"; // Importar el ícono de añadir
import Search from "../filtros/Search";
import { getFilePerson } from "../../service/service";

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenPersonForm: (open: boolean) => void;
  params:URLSearchParams;
}

export const FilterPanelToobar: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  onOpenPersonForm,
  params,
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        mb: 2,
        width: "100%",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{ width: "100%" }}
      >
        {/* Search con límite de ancho */}
        <Box sx={{ flexGrow: 1, minWidth: 300, maxWidth: 400 }}>
          <Search
            text="Buscar persona "
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchTerm}
            // value={search}
          />
        </Box>

        {/* Botones con espacio entre ellos */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="outlined"
            color="primary"
            // size="small"
            sx={{ minWidth: "150px", maxWidth: "200px" }}
            onClick={()=>getFilePerson(params)}
          >
            <FilterListIcon />
            Exportar
          </Button>
          <Button
            variant="contained"
            color="primary"
            // size="small"
            sx={{
              minWidth: "150px",
              maxWidth: "200px",
              // border: "1px solid rgba(7, 7, 7, 0.97)",
              // backgroundColor: "primary",
              // color: "#fff",
            }}
            onClick={() => onOpenPersonForm(true)}
          >
            <AddIcon />
            Crear
          </Button>
        </Stack>
      </Box>
    </Toolbar>
  );
};
