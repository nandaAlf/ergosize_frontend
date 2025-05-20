/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, memo } from "react";
import { StudyData } from "../../types";
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
            </Box>

            <Divider />
            <Grid container spacing={2}  mt={2} alignItems="center">
              {/* Columna izquierda - Datos del estudio */}
              <Grid size={{ xs: 8, sm: 9 }}>
                <Stack spacing={1}>
                  {/* Fechas */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {study.start_date ? study.start_date.toString() : ""} /{" "}
                      {study.end_date ? study.end_date.toString() : ""}
                    </Typography>
                  </Box>

                  {/* Ubicación */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {[study.location, study.country]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Box>

                  {/* Miembros */}
                  <Tooltip title="Participantes registrados">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <GroupsIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {study.current_size} / {study.size} miembros
                      </Typography>
                    </Box>
                  </Tooltip>
                </Stack>
              </Grid>

              {/* Columna derecha - Progreso circular */}
              <Grid size={{ xs: 4, sm: 3 }}>
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
              </Grid>
            </Grid>
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

            <Divider textAlign="left" sx={{ mt: 2, mb: 2 }}></Divider>
            <Typography
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
            </Typography>

            <Divider textAlign="left">Dimensiones</Divider>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
              {study.dimensions?.map((dim) => (
                <Box
                  key={dim.id_dimension}
                  sx={{
                    px: 1.5,
                    py: 0.5,

                    border: "0.5px solid",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    minWidth: "60px",
                  }}
                >
                  <Tooltip title={dim.name}>
                    <Typography variant="caption">{dim.initial}</Typography>
                  </Tooltip>
                </Box>
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
