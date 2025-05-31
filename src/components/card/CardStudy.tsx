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
} from "@mui/material";
import useNavigation from "../../hooks/useNavigation";
import LongMenu from "../Menu";
import {
  LocationOnOutlined as LocationIcon,
  GroupsOutlined as GroupsIcon,
  CalendarMonthOutlined as CalendarIcon,
} from "@mui/icons-material";
import { deleteData } from "../../service/service";
import { useConfirmDialog } from "../../hooks/useConfirmation";
import { parseJwt } from "../../hooks/parseJwt";
import { useNotify } from "../../hooks/useNotifications";
import CircularWithValueLabel from "../CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    const { confirm } = useConfirmDialog(); // Eliminado dialog si no se usa
    const token = localStorage.getItem("access_token") || "";
    const payload = useMemo(() => (token ? parseJwt(token) : null), [token]);
    const currentUserId = payload?.user_id;
    const currentUserRole = payload?.role;
    const notify = useNotify();

    const isOwner = currentUserId === study.supervisor;
    const isAdmin = currentUserRole === "admin";

    const handleDeleteStudy = useCallback(
      async (studyId: number) => {
        try {
          const isConfirmed = await confirm({
            title: "Eliminar estudio",
            description:
              "¿Estás seguro de querer eliminar este estudio? Esta acción es irreversible",
            acceptLabel: "Eliminar",
            cancelLabel: "Cancelar",
          });
          if (isConfirmed) {
            await deleteData(studyId);
            if (onSuccess) onSuccess();
            notify.success("Estudio eliminado correctamente");
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
            {(isOwner || isAdmin) && (
              <LongMenu
                options={["Editar", "Eliminar", "Ver mediciones", "Tablas"]}
                onAction={handleMenuAction}
              />
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
//     const { confirm, dialog } = useConfirmDialog();
//     // Extract current user ID and role from token
//     const token = localStorage.getItem("access_token") || "";
//     const payload: any = token ? parseJwt(token) : null;
//     const currentUserId = payload?.user_id;
//     const currentUserRole = payload?.role;
//     const notify = useNotify();
//     const theme = useTheme();
//     // Determine if current user is supervisor or admin
//     const isOwner = currentUserId === study.supervisor;
//     const isAdmin = currentUserRole === "admin";
//     const handleDeleteStudy = useCallback(
//       async (studyId: number) => {
//         // console.log("elimi")
//         try {
//           const isConfirmed = await confirm({
//             title: "Eliminar estudio",
//             description:
//               "¿Estás seguro de querer eliminar este estudio? Esta acción es irreversible",
//             acceptLabel: "Eliminar",
//             cancelLabel: "Cancelar",
//           });
//           if (isConfirmed) {
//             await deleteData(studyId);
//             if (onSuccess) onSuccess();
//             notify.success("Estudio eliminado correctamente");
//             // Agrega aquí cualquier lógica adicional después de eliminar
//           }
//         } catch (error) {
//           console.error("Error al eliminar estudio:", error);
//         }
//       },
//       [confirm]
//     );

//     const handleMenuAction = useCallback(
//       (action: string) => {
//         switch (action) {
//           case "Editar":
//             return onEdit(study);
//           case "Eliminar":
//             return study.id && handleDeleteStudy(study.id);
//           // return study.id && deleteData(study.id);
//           // return;
//           case "Ver mediciones":
//             return goToPage(`/studies/${study.id}`, { study });
//           case "Tablas":
//           default:
//             return onOpenTable(study);
//         }
//       },
//       [study, onEdit, onOpenTable, goToPage]
//     );

//     return (
//       <>
//         <Card
//           elevation={0}
//           onClick={onSelect}
//           sx={{
//             width: "100%",
//             height: "100%",
//             border: selected ? "20px solid" : "1px solid #E5E7EB",
//             // borderColor: selected ? "primary.main" : undefined,
//             // borderRadius: 2,
//             display: "flex",
//             flexDirection: "column",
//             transition: "background-color 0.2s",
//             "&:hover": { backgroundColor: "action.hover" },
//           }}
//         >
//           <CardContent
//             sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//               {(isOwner || isAdmin) && (
//                 <LongMenu
//                   options={["Editar", "Eliminar", "Ver mediciones", "Tablas"]}
//                   onAction={handleMenuAction}
//                 />
//               )}
//               {/* Botón Tablas visible para todos */}

//               <Typography
//                 variant="h6"
//                 noWrap
//                 sx={{ ml: 1, flex: 1, fontWeight: 500 }}
//               >
//                 {study.name}
//               </Typography>
//               <Box sx={{ position: "relative", display: "inline-flex" }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={((study.current_size || 0) / (study.size || 1)) * 100}
//                   size={32}
//                   thickness={4}
//                   sx={{
//                     color: (theme) =>
//                       (study.current_size || 0) >= study.size
//                         ? theme.palette.success.main
//                         : theme.palette.primary.main,
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     position: "absolute",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     component="div"
//                     color="text.secondary"
//                     fontSize={10}
//                   >
//                     {Math.round(((study.current_size || 0) / study.size) * 100)}
//                     %
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>

//             <Divider />

//             <Stack spacing={1.5} mt={1}>
//               {/* Fechas */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <CalendarIcon
//                   // fontSize="small"
//                   sx={{ fontSize: 18, color: "text.disabled" }}
//                 />
//                 <Typography variant="body2" color="text.primary">
//                   {study.start_date ? study.start_date.toString() : ""} /{" "}
//                   {study.end_date ? study.end_date.toString() : ""}
//                 </Typography>
//               </Box>

//               {/* Ubicación */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <LocationIcon
//                   // fontSize="small"
//                   sx={{ fontSize: 18, color: "text.disabled" }}
//                 />
//                 <Typography variant="body2" color="text.primary">
//                   {[study.location, study.country].filter(Boolean).join(", ")}
//                 </Typography>
//               </Box>

//               {/* Miembros */}
//               <Tooltip title="Participantes registrados">
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <GroupsIcon
//                     fontSize="small"
//                     sx={{ fontSize: 18, color: "text.disabled" }}
//                   />
//                   <Typography variant="body2" color="text.primary">
//                     {study.current_size} {"de"} {study.size} participantes
//                   </Typography>
//                 </Box>
//               </Tooltip>

//               <Box display="flex" gap={1}>
//                 <Typography
//                   variant="body2"
//                   // color="text.secondary"
//                   // paragraph
//                   sx={{
//                     color: "text.disabled",
//                   }}
//                 >
//                   Descripción:
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   color="text.primary"
//                   paragraph
//                   sx={{
//                     display: "-webkit-box",
//                     WebkitLineClamp: 3,
//                     WebkitBoxOrient: "vertical",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {study.description}
//                 </Typography>
//               </Box>
//             </Stack>
//             {/* </Grid> */}

//             <Divider textAlign="left" sx={{ my: 0 }}>
//               <Typography variant="subtitle2" color="text.primary">
//                 Clasificación de dimensiones
//               </Typography>
//             </Divider>

//             <Box>
//               {Object.entries(study.dimensions ?? {}) // study.dimensions es GroupedDimensions
//                 .map(([category, dims]) => ({
//                   category,
//                   dims,
//                 }))
//                 .map(({ category, dims }) => (
//                   <Accordion
//                     key={category}
//                     disableGutters
//                     elevation={0}
//                     square={false}
//                     sx={{
//                       border: 1,
//                       borderColor: "divider",
//                       borderRadius: 1,
//                       "&:before": { display: "none" },
//                       mb: 0.8,
//                     }}
//                   >
//                     <AccordionSummary
//                       expandIcon={
//                         <ExpandMoreIcon sx={{ color: "text.disabled" }} />
//                       }
//                     >
//                       <Typography
//                         variant="subtitle1"
//                         color="text.primary"
//                         sx={{ fontWeight: 600 }}
//                       >
//                         {category} ({dims.length})
//                       </Typography>
//                     </AccordionSummary>
//                     <AccordionDetails
//                       sx={{
//                         p: 1,
//                         // límite de alto + scroll si hay muchas dimensiones
//                         maxHeight: 200,
//                         overflowY: "auto",
//                         bgcolor: "background.default",
//                       }}
//                     >
//                       <Box display="flex" flexWrap="wrap" gap={1}>
//                         {dims.map((dim) => (
//                           <Tooltip
//                             key={dim.id_dimension}
//                             title={dim.name}
//                             arrow
//                           >
//                             <Box
//                               sx={{
//                                 px: 2,
//                                 py: 0.75,
//                                 border: 1,
//                                 borderColor: "divider",
//                                 // border: `1px solid ${theme.palette.divider}`,
//                                 borderRadius: 2,
//                                 bgcolor: "background.paper",
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 "&:hover": { boxShadow: theme.shadows[1] },
//                               }}
//                             >
//                               <Typography
//                                 variant="body2"
//                                 sx={{
//                                   fontSize: "0.85rem",
//                                   fontWeight: 500,
//                                   color: "text.secondary",
//                                 }}
//                               >
//                                 {dim.name.length > 25 ? dim.initial : dim.name}
//                               </Typography>
//                             </Box>
//                           </Tooltip>
//                         ))}
//                       </Box>
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//             </Box>
//           </CardContent>
//         </Card>
//         {dialog} {/* Renderiza el modal de confirmación */}
//       </>
//     );
//   }
// );

export default CardStudy;
