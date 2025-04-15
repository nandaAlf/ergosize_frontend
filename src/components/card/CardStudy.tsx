import React from "react";
import { StudyData } from "../../types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Tooltip,
  CardActionArea,
  Divider,
  Box,
} from "@mui/material";
import useNavigation from "../../hooks/useNavigation";
import LongMenu from "../Menu";
interface CardStudyProps {
  study: StudyData;
  selectedCard: number;
  setSelectedCard: (index: number) => void;
  index: number;
  onEdit: (study: StudyData) => void;
  handleOpenTableDialog: (study: StudyData) => void;
}

const CardStudy: React.FC<CardStudyProps> = ({
  // id,
  // name,
  // description,
  // location,
  // country,
  study,
  selectedCard,
  setSelectedCard,
  index,
  onEdit,
  handleOpenTableDialog,
}) => {
  const { goToPage } = useNavigation();
  const handleMenuAction = (action: string) => {
    if (action === "Editar") {
      onEdit(study);
    } else if (action === "Eliminar") {
      alert("Delete");
      // Lógica para eliminar
    } else if (action === "Ver mediciones") {
      // Pasar los datos del estudio como estado
      goToPage(`/studies/${study.id}`, {
        study,
      });
    }
  };
  const handleClick = () => {
    alert("Ver detalles");
  };
  return (
    <Card
      sx={{
        width: "100%",
        margin: "0 ",
        height: "100%",
        border: " 1px solid rgba(0, 0, 0, 0.12)",
        // backgroundColor: "red",
        display: "flex", // Añadido para que el CardActionArea ocupe todo el espacio
        flexDirection: "column", // Añadido para que el contenido se organice verticalmente
      }}
      //  onClick={handleClick}
    >
      {/* <CardActionArea
        // onClick={() => setSelectedCard(index)}
        // data-active={selectedCard === index ? "" : undefined}
        sx={{
          // height: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          "&[data-active]": {
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
            },
          },
        }}
      > */}
      <CardContent
        sx={{
          // padding: "16px",
          flex: 1, // Asegura que el contenido ocupe todo el espacio disponible
          display: "flex",
          flexDirection: "column",
          "&:last-child": {
            // paddingBottom: "16px", // Asegura que no haya padding adicional en la parte inferior
          },
          width: "90%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            // justifyContent: "flex-end",
            marginBottom: "5px",
            // alignItems:"center",
            // backgroundColor:"red",
            margin: "0",
            padding: "0",
          }}
        >
          <Box
            sx={{
              // backgroundColor:"blue",
              marginLeft: "-15px",
            }}
          >
            <LongMenu
              onAction={handleMenuAction}
              options={["Editar", "Eliminar", "Ver mediciones"]}
            />
          </Box>
          <Box sx={{ width: "85%" }}>
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
                marginTop: "0",
                fontWeight: "200px",
                marginLeft: "0px",
                // backgroundColor: "blue",
              }}
            >
              {study.name}
              {/* {id} */}
            </Typography>
          </Box>

          {/* <CircularProgressWithLabel count={60} total={60} /> */}
        </Box>
        <Divider></Divider>
        <Box
          sx={{
            margin: "15px",
            maxWidth: "none", // Desactiva el ancho máximo predeterminado del Box
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {study.start_date as string} {study.end_date as string}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {study.location} / {study.country}
          </Typography>
          <Tooltip title="Miembros">
            <Typography
              variant="body2"
              color="text.secondary"
              // sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {study.size}
            </Typography>
          </Tooltip>
        </Box>

        <Divider></Divider>

        <Box
          sx={{
            margin: "15px",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {study.description}
          </Typography>
        </Box>
        <Divider textAlign="left" sx={{ color: "gray" }}>
          Dimensiones
        </Divider>

        <Box
          sx={{
            margin: "15px",
            display: "flex",
            gap: 1,
            // justifyContent: "center", // Centrar contenido
            flexWrap: "wrap",
          }}
        >
          {/* <ChipsArray items={["Caja 1", "Caja 2", "Caja 3"]} /> */}

          {study.dimensions?.map((dim) => (
            <Box
              key={dim.id_dimension}
              // elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                padding: "7px",
                borderRadius: "50px",
              }}
            >
              <Tooltip title={dim.name}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {dim.initial}
                </Typography>
              </Tooltip>
            </Box>
          ))}
        </Box>

        <Divider> </Divider>

        <Box
          sx={{
            margin: "15px",
          }}
        >
          {/* Botón para generar la tabla antropométrica */}
          <Button
            variant="contained"
            onClick={() => handleOpenTableDialog(study)}
          >
            Generar Tabla
          </Button>
          {/* <Button onAction={handleClick()}>Tabla {">"}</Button> */}
        </Box>
      </CardContent>
      {/* </CardActionArea> */}
    </Card>
  );
};
export default CardStudy;
