/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, memo } from "react";
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
// // Helper to decode JWT and get user_id
// function parseJwt(token: string) {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// }

interface CardStudyProps {
  study: StudyData;
  selected: boolean;
  onSelect: () => void;
  onEdit: (study: StudyData) => void;
  onViewMeasurements: (study: StudyData) => void;
  onOpenTable: (study: StudyData) => void;
  onSuccess?: () => void; // Nueva prop
}

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
    const { confirm, dialog } = useConfirmDialog();
    // Extract current user ID and role from token
    const token = localStorage.getItem("access_token") || "";
    const payload: any = token ? parseJwt(token) : null;
    const currentUserId = payload?.user_id;
    const currentUserRole = payload?.role;
    const notify = useNotify();
    const theme = useTheme();
    // Determine if current user is supervisor or admin
    const isOwner = currentUserId === study.supervisor;
    const isAdmin = currentUserRole === "admin";
    const handleDeleteStudy = useCallback(
      async (studyId: number) => {
        // console.log("elimi")
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
            // Agrega aquí cualquier lógica adicional después de eliminar
          }
        } catch (error) {
          console.error("Error al eliminar estudio:", error);
        }
      },
      [confirm]
    );

    const handleMenuAction = useCallback(
      (action: string) => {
        switch (action) {
          case "Editar":
            return onEdit(study);
          case "Eliminar":
            return study.id && handleDeleteStudy(study.id);
          // return study.id && deleteData(study.id);
          // return;
          case "Ver mediciones":
            return goToPage(`/studies/${study.id}`, { study });
          case "Tablas":
          default:
            return onOpenTable(study);
        }
      },
      [study, onEdit, onOpenTable, goToPage]
    );

    return (
      <>
        {/* <Box
          sx={{
            display: "inline-flex",
            position: "relative",
            top: 70,
            right: -450,
          }}
        >
          <CircularWithValueLabel
            count={study.current_size}
            total={study.size}
          />
        </Box> */}
        <Card
          elevation={0}
          onClick={onSelect}
          sx={{
            width: "100%",
            height: "100%",
            border: selected ? "20px solid" : "1px solid #E5E7EB",
            // borderColor: selected ? "primary.main" : undefined,
            // borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            transition: "background-color 0.2s",
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
              {/* Botón Tablas visible para todos */}

              <Typography
                variant="h6"
                noWrap
                sx={{ ml: 1, flex: 1, fontWeight: 500 }}
              >
                {study.name}
              </Typography>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={((study.current_size || 0) / (study.size || 1)) * 100}
                  size={32}
                  thickness={4}
                  sx={{
                    color: (theme) =>
                      (study.current_size || 0) >= study.size
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
                    {Math.round(((study.current_size || 0) / study.size) * 100)}
                    %
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />
            {/* <Grid container spacing={2} mt={2} alignItems="center"> */}
            {/* Columna izquierda - Datos del estudio */}
            {/* <Grid size={{ xs: 8, sm: 9 }}> */}
            <Stack spacing={1.5} mt={1}>
              {/* Fechas */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon
                  // fontSize="small"
                  sx={{ fontSize: 18, color: "text.disabled" }}
                />
                <Typography variant="body2" color="text.primary">
                  {study.start_date ? study.start_date.toString() : ""} /{" "}
                  {study.end_date ? study.end_date.toString() : ""}
                </Typography>
              </Box>

              {/* Ubicación */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationIcon
                  // fontSize="small"
                  sx={{ fontSize: 18, color: "text.disabled" }}
                />
                <Typography variant="body2" color="text.primary">
                  {[study.location, study.country].filter(Boolean).join(", ")}
                </Typography>
              </Box>

              {/* Miembros */}
              <Tooltip title="Participantes registrados">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupsIcon
                    fontSize="small"
                    sx={{ fontSize: 18, color: "text.disabled" }}
                  />
                  <Typography variant="body2" color="text.primary">
                    {study.current_size} {"de"} {study.size} participantes
                  </Typography>
                </Box>
              </Tooltip>

              <Box display="flex" gap={1}>
                <Typography
                  variant="body2"
                  // color="text.secondary"
                  // paragraph
                  sx={{
                    color: "text.disabled",
                  }}
                >
                  Descripción:
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  paragraph
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
            {/* </Grid> */}

            {/* Columna derecha - Progreso circular */}
            {/* <Grid size={{ xs: 4, sm: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    pr: 2,
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={(study.current_size / study.size) * 100}
                      size={56}
                      thickness={4}
                      sx={{
                        color: (theme) =>
                          study.current_size >= study.size
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
                      >
                        {Math.round((study.current_size / study.size) * 100)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid> */}
            {/* </Grid> */}
            {/* <Stack spacing={1} mt={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                {study.start_date ? study.start_date.toString() : ""} /{" "}
                {study.end_date ? study.end_date.toString() : ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                {study.location}, {study.country}
              </Typography>
              <Tooltip title="Miembros">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <GroupsIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {study.current_size}/{study.size}
              
                </Typography>
              </Tooltip>
            </Stack> */}

            {/* <Divider textAlign="left" sx={{ mt: 2, mb: 2 }}></Divider> */}
            {/* <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {study.description}
            </Typography> */}

            {/* <Divider textAlign="left">Dimensiones</Divider> */}
            <Divider textAlign="left" sx={{ my: 0 }}>
              <Typography variant="subtitle2" color="text.primary">
                Clasificación de dimensiones
              </Typography>
            </Divider>
            {/* <Divider textAlign="left"></Divider>
            <Typography>Clasificacion de las dimensiones</Typography> */}
            {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
              {study.dimensions?.map((dim) => (
                <Box
                  key={dim.id_dimension}
                  sx={{
                    px: 1.5,
                    // py: 0.5,

                    border: "0.5px solid",
                    borderRadius: 1,
                    // display: "flex",
                    alignItems: "center",
                    minWidth: "30%",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  <Grid size={{ xs: 4, sm: 3 }}>
                    <Tooltip
                      title={dim.name}
                      sx={
                        {
                          // display: "-webkit-box",
                          // WebkitLineClamp: 1,
                          // WebkitBoxOrient: "vertical",
                          // overflow: "hidden",
                        }
                      }
                    >
                      <Typography variant="caption">{dim.name}</Typography>
                    </Tooltip>{" "}
                  </Grid>
                </Box>
              ))}
            </Box> */}
            <Box
              sx={
                {
                  // display: "grid",
                  // gridTemplateColumns: "repeat(2, 1fr)", // 3 bloques por fila
                  // gap: 2,
                  // mt: 1.5,
                }
              }
            >
              {/* {study.dimensions?.map((dim) => (
                <Tooltip key={dim.id_dimension} title={dim.name} arrow>
                  <Box
                    sx={{
                      // px: 1.5,
                      py: 0.5,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // minHeight: 40,
                      backgroundColor: theme.palette.background.paper,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        // borderColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[1],
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        textAlign: "center",
                      }}
                    >
                      {dim.name.length > 25 ? dim.initial : dim.name}
                    </Typography>
                  </Box>
                </Tooltip>
              ))} */}

              {/* {(
              Object.entries(study.dimensions ?? {}) as [string, Dimension[]][]
            ).map(([category, dims]) => (
              <Box key={category} mb={3}>
                <Typography variant="h6" gutterBottom>
                  {category}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1}>
                  {dims.map((dim) => (
                    <Tooltip key={dim.id_dimension} title={dim.name} arrow>
                      <Box
                        sx={{
                          py: 0.5,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: theme.palette.background.paper,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": { boxShadow: theme.shadows[1] },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: theme.palette.text.secondary,
                            textAlign: "center",
                          }}
                        >
                          {(dim.name || []).length > 25
                            ? dim.initial
                            : dim.name}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            ))} */}

              {Object.entries(study.dimensions ?? {}) // study.dimensions es GroupedDimensions
                .map(([category, dims]) => ({
                  category,
                  dims,
                }))
                .map(({ category, dims }) => (
                  <Accordion
                    key={category}
                    disableGutters
                    elevation={0}
                    square={false}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      "&:before": { display: "none" },
                      mb: 0.8,
                      // para que no duplique el borde inferior al expandir
                      // "&.Mui-expanded": {
                      //   margin: "auto",
                      // },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: "text.disabled" }} />
                      }
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
                        // límite de alto + scroll si hay muchas dimensiones
                        maxHeight: 200,
                        overflowY: "auto",
                        bgcolor: "background.default",
                      }}
                    >
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {dims.map((dim) => (
                          <Tooltip
                            key={dim.id_dimension}
                            title={dim.name}
                            arrow
                          >
                            <Box
                              sx={{
                                px: 2,
                                py: 0.75,
                                border: 1,
                                borderColor: "divider",
                                // border: `1px solid ${theme.palette.divider}`,
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
                              >
                                {dim.name.length > 25 ? dim.initial : dim.name}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Box>
            {/* <Tooltip title="Tablas"> */}
            {/* <Button
            onClick={() => onOpenTable(study)}
            variant="outlined"
            // sx={{ cursor: "pointer", ml: 1 }}
          >
            {/* <Typography variant="body2" color="primary"> */}
            {/* Tablas */}
            {/* </Typography> */}
            {/* </Button> */}
            {/* </Tooltip> */}
          </CardContent>
        </Card>
        {dialog} {/* Renderiza el modal de confirmación */}
      </>
    );
  }
);

export default CardStudy;
