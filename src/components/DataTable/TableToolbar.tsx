// TableToolbar.tsx
import React from "react";
import {
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

import AddIcon from "@mui/icons-material/Add"; // Importar el ícono de añadir
interface TableToolbarProps {
  numSelected: number;
  onAddPerson: () => void;
  onDeletePerson: () => void;
  onEditPerson:()=>void
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  numSelected,
  onAddPerson,
  onDeletePerson,
  onEditPerson
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionados
        </Typography>
      ) : (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Estudios
          </Typography>
          {/* <Button variant="contained" onClick={()=>{}}>
        Mis Tablas
      </Button> */}
        </>
      )}
      {numSelected === 0 ? ( // Si no hay elementos seleccionados
        <Tooltip title="Añadir persona">
          <IconButton onClick={onAddPerson}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      ) : numSelected === 1 ? ( // Si hay un elemento seleccionado
        <>
          <Tooltip title="Editar">
            <IconButton onClick={onEditPerson}>
              <FilterListIcon /> {/* Icono de editar */}
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={onDeletePerson}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        // Si hay más de un elemento seleccionado
        <Tooltip title="Eliminar">
          <IconButton onClick={onDeletePerson}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      ;
    </Toolbar>
  );
};

export default TableToolbar;
