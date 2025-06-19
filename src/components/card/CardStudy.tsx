/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CalendarMonthOutlined as CalendarIcon,
  GroupsOutlined as GroupsIcon,
  LocationOnOutlined as LocationIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { memo, useCallback, useMemo } from "react";
import { parseJwt } from "../../hooks/parseJwt";
import { useConfirmDialog } from "../../hooks/useConfirmation";
import useNavigation from "../../hooks/useNavigation";
import { useNotify } from "../../hooks/useNotifications";
import { deleteData } from "../../service/service";
import { Dimension, StudyData } from "../../types";
import LongMenu from "../Menu";
// import CircularWithValueLabel from "../CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getPopulationLabel } from "../../utils/getPopulationLabel";

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
            sx={{ fontWeight: 600, fontSize: "14px" }}
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
              <DimensionItem
                key={dim.id_dimension}
                dim={dim}
                category={category}
              />
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
const DimensionItem = memo(
  ({ dim, category }: { dim: Dimension; category: string }) => {
    const theme = useTheme();
    const showTooltip = (dim.name || []).length > 20; // Mostrar tooltip solo si el nombre es largo
    const { goToPage } = useNavigation();
    return (
      <Tooltip
        title={dim.name}
        disableHoverListener={!showTooltip} // Solo activar si el nombre es largo
        arrow
      >
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
            maxWidth: 150, // Ajusta según necesidad
            "&:hover": { boxShadow: theme.shadows[1] },
          }}
          onClick={() =>
            goToPage(
              `/help?category=${encodeURIComponent(category)}&item=${encodeURIComponent(dim.name ?? "")}`
            )
          }
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            {showTooltip ? dim.initial : dim.name}
          </Typography>
        </Box>
      </Tooltip>
    );
  }
);

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
          "&:hover": { backgroundColor: "rgba(229, 231, 235, 0.18)" },
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
                    mr: -1,
                    ml: -1,
                  }}
                >
                  <MoreVertIcon />
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
                <LocationIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={[study.location, study.country].filter(Boolean).join(", ")}
            />
            <StudyInfoItem
              icon={
                <GroupsIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={`Población ${getPopulationLabel(study.classification)} de ${study.age_min} a ${study.age_max} años`}
            />

            <StudyInfoItem
              icon={
                <GroupsIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={`${study.current_size} de ${study.size} participantes`}
              tooltip="Participantes registrados"
            />

            <StudyInfoItem
              icon={
                <CalendarIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              }
              text={`${study.start_date} / ${study.end_date || "--"}`}
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
          <Divider sx={{ my: 1 }} />

          <Box sx={{ mt: 1 }}>
            {/* <Grid container spacing={1}> */}
            {groupedDimensions.map(({ category, dims }) => (
              // <Grid size={{ xs: 12, sm: 6 }} key={category}>

              <DimensionCategoryItem category={category} dims={dims} />
              // </Grid>
            ))}
            {/* </Grid> */}
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
