import React, { useEffect, useState } from "react";
import { studyDataProps } from "../../types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Tooltip,
  Container,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public"; // Icono para "Región"
import FlagIcon from "@mui/icons-material/Flag"; // Icono para "País
import useNavigation from "../../hooks/useNavigation";
import CustomMarks from "../Slider";
import ChipsArray from "../Chips";
import CustomizedMenus from "../Menu";
import LongMenu from "../Menu";
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
    <Card sx={{ width: "100%", margin: "0 ", padding:'5px'}} onClick={handleClick}>
      <CardContent>
        <Typography>
          MARZO 20, 2020
        </Typography>
        {/* <Container
          sx={{
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "space-between",
            }}
            > */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
             {location} / {country}
             
            </Typography>
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
              // padding:'2px',
              marginTop: "5px",
              fontWeight:'bold',
              marginLeft: "0px",
              
              // minHeight: "64px",
            }}
          >
            {name}
            {/* {id} */}
          </Typography>
       
            
          <Tooltip title="Miembros">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
             Tamaño de la muestra: 20/45 "  Estado del estudio: 60%completado                                                    "         
          </Typography>
        </Tooltip> 
          {/* <Tooltip title={description}> */}
          {/* </Tooltip> */}
          {/* <LongMenu></LongMenu> */}
        {/* </Container> */}
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

       

        {/* <Tooltip title="Sexo">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FlagIcon fontSize="small" /> Mixto
          </Typography>
        </Tooltip>

        <Tooltip title="Miembros">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FlagIcon fontSize="small" /> 20/45
          </Typography>
        </Tooltip> */}

        {/* <ChipsArray></ChipsArray> */}
      </CardContent>
    </Card>
  );
};
export default CardStudy;
