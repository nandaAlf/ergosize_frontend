// EnhancedTableToolbar.tsx
import * as React from "react";
import { Toolbar, Typography, IconButton, Tooltip, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add"; // Importar el ícono de añadir
interface EnhancedTableToolbarProps {
  numSelected: number;
  onAddPerson: () => void;
  onEditPerson:()=>void;
  onDeletePerson:()=>void;
  title: string;
}

export const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  numSelected,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
  title
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
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
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
       {numSelected == 1 ? (
        <>
        <Tooltip title="Editar">
          <IconButton onClick={onEditPerson}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
         <Tooltip title="Ficha">
         <IconButton >
           F
         </IconButton>
       </Tooltip>
        </>
      ) : (
        <></>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDeletePerson}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Insertar">
           <IconButton onClick={onAddPerson} >
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
     
    </Toolbar>
  );
};
