import Tooltip from "@mui/material/Tooltip";

import IconButton from "@mui/material/IconButton";
import { ReactElement } from "react"; // Importar ReactElement para tipar el ícono
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import Chip from "@mui/material/Chip";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { ButtonProps, Stack } from "@mui/material";
interface HeaderCardProps {
  title: string;
  description?: string;
  metadata?: {
    icon: ReactElement;
    label: string;
  }[];
  buttons?: {
    label: string;
    onClick: () => void;
    icon?: ReactElement;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
  }[];
  gradient?: string;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({
  title,
  description,
  metadata = [],
  buttons = [],
  gradient = "linear-gradient(135deg, rgba(107, 17, 203, 0.3) 0%, rgba(37, 116, 252, 0.73) 100%)",
}) => {
  return (
    <Paper
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 2,
        background:
          "linear-gradient(135deg,rgba(107, 17, 203, 0.3) 0%,rgba(37, 116, 252, 0.73) 100%)",
        color: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1}>
            {title}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ opacity: 0.9 }}>
            {description}
          </Typography>
          {metadata.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
              {metadata.map((item, index) => (
                <Chip
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  sx={{ background: "rgba(255,255,255,0.2)" }}
                />
              ))}
            </Box>
          )}
          {/* <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
            <Chip
              icon={<PlaceIcon />}
              label={`Lugar: ${location}`}
              sx={{ background: "rgba(255,255,255,0.2)" }}
            />
            <Chip
              icon={<GroupsIcon />}
              label={`Muestra: ${size}`}
              sx={{ background: "rgba(255,255,255,0.2)" }}
            />
            <Chip
              icon={<CalendarMonth />}
              label={`${start_date} → ${end_date || "-"}`}
              sx={{ background: "rgba(255,255,255,0.2)" }}
            />
          </Box> */}
        </Box>

        {buttons.length > 0 && (
          <Stack direction="row" spacing={2}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || "contained"}
                onClick={button.onClick}
                startIcon={button.icon}
                color={button.color}
                sx={{
                  bgcolor: button.variant === "contained" ? "white" : undefined,
                  color: button.variant === "contained" ? "#2575fc" : "white",
                  "&:hover": {
                    bgcolor:
                      button.variant === "contained"
                        ? "#f0f0f0"
                        : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        )}
        {/* 
        <Button
          variant="contained"
          onClick={handleExportClick}
          // startIcon={<FileDownloadIcon />}
          sx={
            {
              // // bgcolor: "white",
              // // color: "#2575fc",
              // "&:hover": { bgcolor: "#f0f0f0" },
            }
          }
        >
          Exportar
        </Button> */}
      </Box>
    </Paper>
  );
};
