/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, memo, useMemo } from "react";
import { Dimension, StudyData } from "../../types";
import {
  Card,
  CardContent,
  Typography,
  Tooltip,
  Divider,
  Box,
  Stack,
  Button,
  Grid,
  CircularProgress,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import useNavigation from "../../hooks/useNavigation";
import LongMenu from "../Menu";
import {
  LocationOnOutlined as LocationIcon,
  GroupsOutlined as GroupsIcon,
  CalendarMonthOutlined as CalendarIcon,
  TableChart,
} from "@mui/icons-material";
import { deleteData } from "../../service/service";
import { useConfirmDialog } from "../../hooks/useConfirmation";
import { parseJwt } from "../../hooks/parseJwt";
import { useNotify } from "../../hooks/useNotifications";
// import CircularWithValueLabel from "../CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface CardStudyProps {
  study: StudyData;
  selected: boolean;
  onSelect: () => void;
  onEdit: (study: StudyData) => void;
  onViewMeasurements: (study: StudyData) => void;
  onOpenTable: (study: StudyData) => void;
  onSuccess?: () => void; // Nueva prop
}

// Componente memoizado para mostrar información de dimensiones
const DimensionCategoryItem = memo(
  ({ category, dims }: { category: string; dims: Dimension[] }) => {
    const theme = useTheme();

    return (
      <Accordion
        disableGutters
        elevation={0}
        square={false}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          "&:before": { display: "none" },
          mb: 0.8,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "text.disabled" }} />}
        >
          <Typography
            variant="subtitle1"
            color="text.primary"
            sx={{ fontWeight: 600 }}
          >
            {category} ({dims.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: 1,
            maxHeight: 200,
            overflowY: "auto",
            bgcolor: "background.default",
          }}
        >
          <Box display="flex" flexWrap="wrap" gap={1}>
            {dims.map((dim) => (
              <DimensionItem key={dim.id_dimension} dim={dim} />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

// Componente para mostrar el progreso
const ProgressIndicator = memo(({ study }: { study: StudyData }) => {
  const theme = useTheme();
  const progress = useMemo(
    () => Math.round(((study.current_size || 0) / study.size) * 100),
    [study.current_size, study.size]
  );

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={32}
        thickness={4}
        sx={{
          color:
            progress >= 100
              ? theme.palette.success.main
              : theme.palette.primary.main,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          component="div"
          color="text.secondary"
          fontSize={10}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
});

// Componente memoizado para cada dimensión
const DimensionItem = memo(({ dim }: { dim: Dimension }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 2,
        py: 0.75,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        "&:hover": { boxShadow: theme.shadows[1] },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "text.secondary",
        }}
        title={dim.name} // Tooltip nativo para mejor rendimiento
      >
        {(dim.name || []).length > 25 ? dim.initial : dim.name}
      </Typography>
    </Box>
  );
});

const CardStudy: React.FC<CardStudyProps> = memo(
  ({
    study,
    selected,
    onSelect,
    onEdit,
    onViewMeasurements,
    onOpenTable,
    onSuccess,
  }) => {
    const { goToPage } = useNavigation();
    const { confirm, dialog } = useConfirmDialog(); // Eliminado dialog si no se usa
    const token = localStorage.getItem("access_token") || "";
    const payload = useMemo(() => (token ? parseJwt(token) : null), [token]);
    const currentUserId = payload?.user_id;
    const currentUserRole = payload?.role;
    const notify = useNotify();
    const theme = useTheme();
    const isOwner = currentUserId === study.supervisor;
    const isAdmin = currentUserRole === "admin";

    const handleDeleteStudy = useCallback(
      async (studyId: number) => {
        try {
          alert("kk");
          const isConfirmed = await confirm({
            title: "Eliminar estudio",
            description:
              "¿Estás seguro de querer eliminar este estudio? Esta acción es irreversible",
            acceptLabel: "Eliminar",
            cancelLabel: "Cancelar",
          });
          if (isConfirmed) {
            alert("confirn")
            await deleteData(studyId);
            if (onSuccess) onSuccess();
            notify.success("Estudio eliminado correctamente");
          }
          else{
            alert("no confir")
          }
        } catch (error) {
          console.error("Error al eliminar estudio:", error);
        }
      },
      [confirm, notify, onSuccess]
    );

    const handleMenuAction = useCallback(
      (action: string) => {
        switch (action) {
          case "Editar":
            return onEdit(study);
          case "Eliminar":
            return study.id && handleDeleteStudy(study.id);
          case "Ver mediciones":
            return goToPage(`/studies/${study.id}`, { study });
          case "Tablas":
            return onOpenTable(study);
          default:
            return;
        }
      },
      [study, onEdit, handleDeleteStudy, goToPage, onOpenTable]
    );

    // Memoizar las dimensiones agrupadas
    const groupedDimensions = useMemo(() => {
      return Object.entries(study.dimensions ?? {}).map(([category, dims]) => ({
        category,
        dims,
      }));
    }, [study.dimensions]);

    return (
      <Card
        elevation={0}
        onClick={onSelect}
        sx={{
          width: "100%",
          height: "100%",
          border: selected ? "2px solid" : "1px solid #E5E7EB",
          borderColor: selected ? "primary.main" : undefined,
          display: "flex",
          flexDirection: "column",
          transition: "background-color 0.2s, border-color 0.2s",
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {isOwner || isAdmin ? (
              <LongMenu
                options={["Editar", "Eliminar", "Ver mediciones", "Tablas"]}
                onAction={handleMenuAction}
              />
            ) : (
              <>
                <IconButton
                  onClick={() => onOpenTable(study)}
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "#fff"
                        : theme.palette.primary.main,
                    background: `linear-gradient(45deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}30)`,
                    },
                    mr:-1,
                    ml:-1,
                  }}
                >
                 <MoreVertIcon/>
                </IconButton>
              </>
            )}

            <Typography
              variant="h6"
              noWrap
              sx={{ ml: 1, flex: 1, fontWeight: 500 }}
            >
              {study.name}
            </Typography>

            <ProgressIndicator study={study} />
          </Box>

          <Divider />

          <Stack spacing={1.5} mt={1}>
            <StudyInfoItem
              icon={
                <CalendarIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={`${study.start_date} / ${study.end_date}`}
            />

            <StudyInfoItem
              icon={
                <LocationIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={[study.location, study.country].filter(Boolean).join(", ")}
            />

            <StudyInfoItem
              icon={
                <GroupsIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={`${study.current_size} de ${study.size} participantes`}
              tooltip="Participantes registrados"
            />

            <Box display="flex" gap={1}>
              <Typography variant="body2" sx={{ color: "text.disabled" }}>
                Descripción:
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {study.description}
              </Typography>
            </Box>
          </Stack>

          <Divider textAlign="left" sx={{ my: 1 }}>
            <Typography variant="subtitle2" color="text.primary">
              Clasificación de dimensiones
            </Typography>
          </Divider>

          <Box sx={{ mt: 1 }}>
            {groupedDimensions.map(({ category, dims }) => (
              <DimensionCategoryItem
                key={category}
                category={category}
                dims={dims}
              />
            ))}
          </Box>
        </CardContent>
        {dialog}
      </Card>
    );
  }
);

// Componente memoizado para items de información
const StudyInfoItem = memo(
  ({
    icon,
    text,
    tooltip,
  }: {
    icon: React.ReactNode;
    text: string;
    tooltip?: string;
  }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      {tooltip ? (
        <Typography variant="body2" color="text.primary" title={tooltip}>
          {text}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.primary">
          {text}
        </Typography>
      )}
    </Box>
  )
);

export default CardStudy;

//REVISAR NUEVOS ESTILOS
// import React, { memo, useCallback, useMemo, useState } from "react";
// import {
//   Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails,
//   CircularProgress, IconButton, Menu, MenuItem, Paper, Stack, Tooltip,
//   useTheme, Badge, Button
// } from "@mui/material";
// import {
//   CalendarToday, LocationOn, People, ExpandMore, MoreVert,
//   Description, TableChart, Visibility, Edit, Delete,
//   CheckCircle, Error
// } from "@mui/icons-material";
// import { StudyData, Dimension } from "../../types";
// // import { parseJwt } from "../../utils/auth";
// // import { useConfirmDialog } from "../../hooks/useConfirmDialog";
// // import { useNotify } from "../../hooks/useNotify";
// // import { useNavigation } from "../../hooks/useNavigation";

// interface CardStudyProps {
//   study: StudyData;
//   selected: boolean;
//   onSelect: () => void;
//   onEdit: (study: StudyData) => void;
//   onViewMeasurements: (study: StudyData) => void;
//   onOpenTable: (study: StudyData) => void;
//   onSuccess?: () => void;
// }

// // Componente memoizado para mostrar información de dimensiones
// const DimensionCategoryItem = memo(
//   ({ category, dims }: { category: string; dims: Dimension[] }) => {
//     const theme = useTheme();

//     return (
//       <Accordion
//         disableGutters
//         elevation={0}
//         square={false}
//         sx={{
//           border: 1,
//           borderColor: "divider",
//           borderRadius: 1,
//           "&:before": { display: "none" },
//           mb: 1,
//           background: theme.palette.background.paper,
//         }}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}
//           sx={{
//             bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
//             borderRadius: '8px 8px 0 0',
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             color="text.primary"
//             sx={{ fontWeight: 600 }}
//           >
//             {category} <Badge badgeContent={dims.length} color="primary" sx={{ ml: 1 }} />
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails
//           sx={{
//             p: 1,
//             maxHeight: 200,
//             overflowY: "auto",
//           }}
//         >
//           <Box display="flex" flexWrap="wrap" gap={1}>
//             {dims.map((dim) => (
//               <DimensionItem key={dim.id_dimension} dim={dim} />
//             ))}
//           </Box>
//         </AccordionDetails>
//       </Accordion>
//     );
//   }
// );

// // Componente para mostrar el progreso
// const ProgressIndicator = memo(({ study }: { study: StudyData }) => {
//   const theme = useTheme();
//   const progress = useMemo(
//     () => Math.round(((study.current_size || 0) / study.size) * 100),
//     [study.current_size, study.size]
//   );

//   return (
//     <Box sx={{ position: "relative", display: "inline-flex" }}>
//       <CircularProgress
//         variant="determinate"
//         value={progress}
//         size={32}
//         thickness={4}
//         sx={{
//           color:
//             progress >= 100
//               ? theme.palette.success.main
//               : theme.palette.primary.main,
//         }}
//       />
//       <Box
//         sx={{
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 0,
//           position: "absolute",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography
//           variant="body2"
//           component="div"
//           color={progress >= 100 ? "success.main" : "primary.main"}
//           fontSize={10}
//           fontWeight={700}
//         >
//           {progress}%
//         </Typography>
//       </Box>
//     </Box>
//   );
// });

// // Componente memoizado para cada dimensión
// const DimensionItem = memo(({ dim }: { dim: Dimension }) => {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         px: 1.5,
//         py: 0.75,
//         border: 1,
//         borderColor: "divider",
//         borderRadius: 2,
//         bgcolor: theme.palette.background.default,
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//         whiteSpace: "nowrap",
//         boxShadow: theme.shadows[1],
//         transition: 'all 0.2s',
//         '&:hover': {
//           transform: 'translateY(-2px)',
//           boxShadow: theme.shadows[3],
//           borderColor: theme.palette.primary.main,
//         }
//       }}
//     >
//       <Typography
//         variant="body2"
//         sx={{
//           fontSize: "0.85rem",
//           fontWeight: 500,
//           color: "text.secondary",
//         }}
//         title={dim.name}
//       >
//         {(dim.name || []).length > 25 ? dim.initial : dim.name}
//       </Typography>
//     </Box>
//   );
// });

// const LongMenu = memo(({ options, onAction }: {
//   options: string[];
//   onAction: (action: string) => void
// }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = (event: React.MouseEvent, action?: string) => {
//     event.stopPropagation();
//     setAnchorEl(null);
//     if (action) onAction(action);
//   };

//   const getIcon = (option: string) => {
//     switch (option) {
//       case 'Editar': return <Edit fontSize="small" />;
//       case 'Eliminar': return <Delete fontSize="small" />;
//       case 'Ver mediciones': return <Visibility fontSize="small" />;
//       case 'Tablas': return <TableChart fontSize="small" />;
//       default: return null;
//     }
//   };

//   return (
//     <div>
//       <IconButton
//         aria-label="more"
//         aria-controls={open ? 'long-menu' : undefined}
//         aria-expanded={open ? 'true' : undefined}
//         aria-haspopup="true"
//         onClick={handleClick}
//         size="small"
//         sx={{
//           color: 'inherit',
//           '&:hover': {
//             backgroundColor: 'rgba(255, 255, 255, 0.1)'
//           }
//         }}
//       >
//         <MoreVert />
//       </IconButton>
//       <Menu
//         id="long-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         onClick={(e) => e.stopPropagation()}
//         MenuListProps={{
//           'aria-labelledby': 'long-button',
//         }}
//         PaperProps={{
//           style: {
//             maxHeight: 48 * 4.5,
//             width: '20ch',
//           },
//         }}
//       >
//         {options.map((option) => (
//           <MenuItem
//             key={option}
//             onClick={(e) => handleClose(e, option)}
//             sx={{ gap: 1 }}
//           >
//             {getIcon(option)}
//             {option}
//           </MenuItem>
//         ))}
//       </Menu>
//     </div>
//   );
// });

// const CardStudy: React.FC<CardStudyProps> = memo(
//   ({
//     study,
//     selected,
//     onSelect,
//     onEdit,
//     onViewMeasurements,
//     onOpenTable,
//     onSuccess,
//   }) => {
//     const { goToPage } = useNavigation();
//     const { confirm } = useConfirmDialog();
//     const notify = useNotify();
//     const theme = useTheme();

//     const token = localStorage.getItem("access_token") || "";
//     const payload = useMemo(() => (token ? parseJwt(token) : null), [token]);
//     const currentUserId = payload?.user_id;
//     const currentUserRole = payload?.role;

//     const isOwner = currentUserId === study.supervisor;
//     const isAdmin = currentUserRole === "admin";
//     const progress = Math.round(((study.current_size || 0) / study.size) * 100);
//     const isComplete = progress >= 100;

//     const handleDeleteStudy = useCallback(
//       async (studyId: number) => {
//         try {
//           const isConfirmed = await confirm({
//             title: "Eliminar estudio",
//             description:
//               "¿Estás seguro de querer eliminar este estudio? Esta acción es irreversible",
//             acceptLabel: "Eliminar",
//             cancelLabel: "Cancelar",
//           });
//           if (isConfirmed) {
//             // await deleteData(studyId);
//             if (onSuccess) onSuccess();
//             notify.success("Estudio eliminado correctamente");
//           }
//         } catch (error) {
//           console.error("Error al eliminar estudio:", error);
//         }
//       },
//       [confirm, notify, onSuccess]
//     );

//     const handleMenuAction = useCallback(
//       (action: string) => {
//         switch (action) {
//           case "Editar":
//             return onEdit(study);
//           case "Eliminar":
//             return study.id && handleDeleteStudy(study.id);
//           case "Ver mediciones":
//             return goToPage(`/studies/${study.id}`, { study });
//           case "Tablas":
//             return onOpenTable(study);
//           default:
//             return;
//         }
//       },
//       [study, onEdit, handleDeleteStudy, goToPage, onOpenTable]
//     );

//     // Memoizar las dimensiones agrupadas
//     const groupedDimensions = useMemo(() => {
//       return Object.entries(study.dimensions ?? {}).map(([category, dims]) => ({
//         category,
//         dims,
//       }));
//     }, [study.dimensions]);

//     return (
//       <Paper
//         elevation={selected ? 8 : 4}
//         onClick={onSelect}
//         sx={{
//           width: "100%",
//           height: "100%",
//           border: selected ? "2px solid" : "1px solid",
//           borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
//           display: "flex",
//           flexDirection: "column",
//           transition: "all 0.3s ease",
//           borderRadius: '16px',
//           overflow: 'hidden',
//           background: theme.palette.background.paper,
//           "&:hover": {
//             transform: 'translateY(-5px)',
//             boxShadow: theme.shadows[8],
//           },
//           position: 'relative',
//         }}
//       >
//         {/* Ribbon de estado */}
//         <Box sx={{
//           position: 'absolute',
//           top: 16,
//           right: -30,
//           width: 120,
//           backgroundColor: isComplete ? theme.palette.success.main : theme.palette.primary.main,
//           color: theme.palette.common.white,
//           textAlign: 'center',
//           transform: 'rotate(45deg)',
//           fontSize: '0.75rem',
//           fontWeight: 700,
//           padding: '3px 0',
//           zIndex: 1,
//         }}>
//           {isComplete ? 'COMPLETADO' : 'EN PROGRESO'}
//         </Box>

//         {/* Encabezado con gradiente */}
//         <Box
//           sx={{
//             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//             color: theme.palette.common.white,
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               {isComplete ? (
//                 <CheckCircle sx={{ color: theme.palette.success.light, mr: 1 }} />
//               ) : (
//                 <Error sx={{ color: theme.palette.warning.light, mr: 1 }} />
//               )}
//               <Typography
//                 variant="h6"
//                 noWrap
//                 sx={{ fontWeight: 700, maxWidth: 'calc(100% - 60px)' }}
//               >
//                 {study.name}
//               </Typography>
//             </Box>

//             {(isOwner || isAdmin) && (
//               <LongMenu
//                 options={["Editar", "Eliminar", "Ver mediciones", "Tablas"]}
//                 onAction={handleMenuAction}
//               />
//             )}
//           </Box>
//         </Box>

//         <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
//           <Stack spacing={1.5} mb={2}>
//             <StudyInfoItem
//               icon={
//                 <CalendarToday sx={{ fontSize: 18, color: theme.palette.primary.main }} />
//               }
//               text={`${study.start_date} / ${study.end_date}`}
//             />

//             <StudyInfoItem
//               icon={
//                 <LocationOn sx={{ fontSize: 18, color: theme.palette.primary.main }} />
//               }
//               text={[study.location, study.country].filter(Boolean).join(", ")}
//             />

//             <StudyInfoItem
//               icon={
//                 <People sx={{ fontSize: 18, color: theme.palette.primary.main }} />
//               }
//               text={`${study.current_size} de ${study.size} participantes`}
//               tooltip="Participantes registrados"
//               progress={progress}
//             />
//           </Stack>

//           <Box mb={2} sx={{ flex: 1 }}>
//             <Typography variant="body2" sx={{ color: "text.disabled", mb: 0.5 }}>
//               Descripción:
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.primary"
//               sx={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 bgcolor: theme.palette.background.default,
//                 p: 1.5,
//                 borderRadius: '8px',
//               }}
//             >
//               {study.description || "No hay descripción disponible"}
//             </Typography>
//           </Box>

//           <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

//           <Box mb={1}>
//             <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
//               Clasificación de dimensiones
//             </Typography>

//             <Box sx={{ mt: 1 }}>
//               {groupedDimensions.map(({ category, dims }) => (
//                 <DimensionCategoryItem
//                   key={category}
//                   category={category}
//                   dims={dims}
//                 />
//               ))}
//             </Box>
//           </Box>
//         </Box>

//         <Box sx={{
//           p: 2,
//           display: 'flex',
//           justifyContent: 'space-between',
//           borderTop: `1px solid ${theme.palette.divider}`,
//           bgcolor: theme.palette.background.default,
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <ProgressIndicator study={study} />
//             <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
//               Progreso
//             </Typography>
//           </Box>

//           <Box>
//             <Button
//               variant="outlined"
//               size="small"
//               startIcon={<Description />}
//               onClick={() => onViewMeasurements(study)}
//               sx={{ mr: 1 }}
//             >
//               Mediciones
//             </Button>
//             <Button
//               variant="contained"
//               size="small"
//               startIcon={<TableChart />}
//               onClick={() => onOpenTable(study)}
//               sx={{
//                 background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//                 boxShadow: theme.shadows[2],
//                 '&:hover': {
//                   boxShadow: theme.shadows[4],
//                 }
//               }}
//             >
//               Tablas
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     );
//   }
// );

// // Componente memoizado para items de información
// const StudyInfoItem = memo(
//   ({
//     icon,
//     text,
//     tooltip,
//     progress
//   }: {
//     icon: React.ReactNode;
//     text: string;
//     tooltip?: string;
//     progress?: number;
//   }) => {
//     const theme = useTheme();

//     return (
//       <Box sx={{
//         display: "flex",
//         alignItems: "center",
//         gap: 1.5,
//         bgcolor: theme.palette.background.default,
//         p: 1.5,
//         borderRadius: '8px',
//       }}>
//         {icon}
//         <Box sx={{ flex: 1 }}>
//           {tooltip ? (
//             <Tooltip title={tooltip}>
//               <Typography variant="body2" color="text.primary">
//                 {text}
//               </Typography>
//             </Tooltip>
//           ) : (
//             <Typography variant="body2" color="text.primary">
//               {text}
//             </Typography>
//           )}
//         </Box>
//       </Box>
//     );
//   }
// );

// export default CardStudy;
