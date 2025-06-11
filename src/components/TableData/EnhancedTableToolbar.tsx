// EnhancedTableToolbar.tsx
import * as React from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  alpha,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add"; // Importar el ícono de añadir
import EditIcon from "@mui/icons-material/Edit";
interface EnhancedTableToolbarProps {
  numSelected: number;
  onAddPerson: () => void;
  onEditPerson: () => void;
  onDeletePerson: () => void;
  title: string;
}

export const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  numSelected,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
  title,
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="h6">{title}</Typography>

          {/* <Typography variant="body2">
            <Box component="span" fontWeight="bold">
              Ubicación:
            </Box>{" "}
            Japón •
            <Box component="span" fontWeight="bold">
              {" "}
              Inicio:
            </Box>{" "}
            1/1/202 •
            <Box component="span" fontWeight="bold">
              {" "}
              Fin:
            </Box>{" "}
            3/5/677
          </Typography>

          <Typography variant="body1" color="text.secondary" fontStyle="italic">
            Descripción": Lorem ipsum dolor sit amet...
          </Typography> */}
        </Box>
        // <>
        //   <Typography
        //     // sx={{ flex: "1 1 100%", ml: 3 }}
        //     sx={{  }}
        //     variant="h6"
        //     id="tableTitle"
        //     component="div"
        //     // fontFamily={"helvetica"}
        //   >
        //     {title}
        //   </Typography>
        //   Ubicacion: Japon
        //   <Typography
        //     sx={{ }}
        //     variant="h6"
        //     id="tableTitle"
        //     component="div"
        //     // fontFamily={"helvetica"}
        //   >
        //     "Descrpcion": lorem
        //   </Typography>
        //   fecha inicion: 1/1/202
        //   fecha fin 3/5/677
        // </>
      )}
      {numSelected == 1 ? (
        <>
          <Tooltip title="Editar">
            <IconButton onClick={onEditPerson}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Ficha">
         <IconButton >
           F
         </IconButton>
       </Tooltip> */}
        </>
      ) : (
        <></>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Eliminar">
          <IconButton onClick={onDeletePerson}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
        // <Tooltip title="Insertar">
        //    <IconButton onClick={onAddPerson} >
        //     <AddIcon />
        //   </IconButton>
        // </Tooltip>
      )}
    </Toolbar>
  );
};
