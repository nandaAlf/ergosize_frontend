import React, { useEffect, useState } from "react";
import { studyDataProps } from "../../types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public"; // Icono para "Región"
import FlagIcon from "@mui/icons-material/Flag"; // Icono para "País
import useNavigation from "../../hooks/useNavigation";
const CardStudy: React.FC<studyDataProps> = ({
  id,
  name,
  description,
  location,
  country,
}) => {
  const { goToPage } = useNavigation();
  const handleClick = () => {
    // Pasar los datos del estudio como estado
    goToPage(`/studies/${id}`, {
      id,
      name,
      description,
      location,
      country,
    });
  };
  return (
    <Card
      sx={{ width: 345, margin: "20px auto" }}
      onClick={handleClick}
    >
      <CardContent>
        <Tooltip title={description}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2, // Limita a 3 líneas
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "64px",
            }}
          >
            {name}
            {id}
          </Typography>
        </Tooltip>
        <Typography
          sx={
            {
              //   display: "-webkit-box",
              //   WebkitLineClamp: 2, // Limita a 3 líneas
              //   WebkitBoxOrient: "vertical",
              //   overflow: "hidden",
              //   textOverflow: "ellipsis",
              //   minHeight: "64px",
            }
          }
        >
          {description}
        </Typography>
        <Tooltip title="Región">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PublicIcon fontSize="small" /> {location}
          </Typography>
        </Tooltip>

        <Tooltip title="País">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FlagIcon fontSize="small" /> {country}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};
export default CardStudy;
