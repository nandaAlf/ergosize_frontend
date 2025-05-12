/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
// import { StudyData } from "../../types";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Tooltip,
//   CardActionArea,
//   Divider,
//   Box,
// } from "@mui/material";
// import useNavigation from "../../hooks/useNavigation";
// import LongMenu from "../Menu";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
// import { deleteData} from "../../service/service";
// interface CardStudyProps {
//   study: StudyData;
//   selectedCard: number;
//   setSelectedCard: (index: number) => void;
//   index: number;
//   onEdit: (study: StudyData) => void;
//   handleOpenTableDialog: (study: StudyData) => void;
// }

// const CardStudy: React.FC<CardStudyProps> = ({
//   study,
//   selectedCard,
//   setSelectedCard,
//   index,
//   onEdit,
//   handleOpenTableDialog,
// }) => {
//   const { goToPage } = useNavigation();
//   const handleMenuAction = (action: string) => {
//     if (action === "Editar") {
//       onEdit(study);
//     } else if (action === "Eliminar") {
//       // alert("Delete");
//       study.id ? deleteData(study.id) : {}
//       // Lógica para eliminar
//     } else if (action === "Ver mediciones") {
//       console.log("Ver dim", study.dimensions);
//       goToPage(`/studies/${study.id}`, {
//         study,
//       });
//     } else {
//       handleOpenTableDialog(study);
//     }
//   };
//   const handleClick = () => {
//     alert("Ver detalles");
//   };
//   return (
//     <Card
//       elevation={0}
//       sx={{
//         width: "100%",
//         margin: "0 ",
//         height: "100%",
//         border: " 1px solid rgba(37, 100, 235, 0.2)",
//         backgroundColor: "transparent",
//         // backgroundColor: "",
//         display: "flex", // Añadido para que el CardActionArea ocupe todo el espacio
//         flexDirection: "column", // Añadido para que el contenido se organice verticalmente
//         borderRadius: "30px",
//         "&:hover": {
//           backgroundColor: "#f5f5f5ff",
//           // cursor: "pointer",
//         },
//       }}
//       //  onClick={handleClick}
//     >
//       {/* <CardActionArea
//         // onClick={() => setSelectedCard(index)}
//         // data-active={selectedCard === index ? "" : undefined}
//         sx={{
//           // height: "100%",
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           "&[data-active]": {
//             backgroundColor: "#fff",
//             "&:hover": {
//               backgroundColor: "#fff",
//             },
//           },
//         }}
//       > */}
//       <CardContent
//         sx={{
//           // padding: "16px",
//           flex: 1, // Asegura que el contenido ocupe todo el espacio disponible
//           display: "flex",
//           flexDirection: "column",
//           "&:last-child": {
//             // paddingBottom: "16px", // Asegura que no haya padding adicional en la parte inferior
//           },
//           width: "90%",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             // justifyContent: "flex-end",
//             marginBottom: "5px",
//             // alignItems:"center",
//             // backgroundColor:"red",
//             margin: "0",
//             padding: "0",
//           }}
//         >
//           <Box
//             sx={{
//               // backgroundColor:"blue",
//               marginLeft: "-15px",
//             }}
//           >
//             <LongMenu
//               onAction={handleMenuAction}
//               options={["Editar", "Eliminar", "Ver mediciones", "Tablas"]} // Añadido "Ver detalles"
//             />
//           </Box>
//           <Box sx={{ width: "85%" }}>
//             <Typography
//               gutterBottom
//               variant="h5"
//               component="div"
//               sx={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 2, // Limita a 3 líneas
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 marginTop: "0",
//                 fontWeight: "200px",
//                 marginLeft: "0px",

//                 // backgroundColor: "blue",
//               }}
//             >
//               {study.name}
//               {/* {id} */}
//             </Typography>
//           </Box>
//         </Box>
//         <Divider></Divider>
//         <Box
//           sx={{
//             margin: "15px",
//             maxWidth: "none", // Desactiva el ancho máximo predeterminado del Box
//           }}
//         >
//           <Typography variant="body2" color="gray">
//           <CalendarMonthOutlinedIcon
//               fontSize="small"
//               sx={{
//                 verticalAlign: "middle",
//                 color: "gray",
//                 mr: 0.5,
//               }}
//             />
//             {study.start_date as string}  / {study.end_date as string}
//           </Typography>
//           <Typography variant="body2" color="gray">
//             <LocationOnOutlinedIcon
//               fontSize="small"
//               sx={{
//                 verticalAlign: "middle",
//                 color: "gray",
//                 mr: 0.5,
//               }}
//             />
//             {study.location} / {study.country}
//           </Typography>
//           <Tooltip title="Miembros">
//             <Typography
//               variant="body2"
//               color="gray"
//               // sx={{ display: "flex", alignItems: "center", gap: 1 }}
//             >
//               <GroupsOutlinedIcon
//                 fontSize="small"
//                 sx={{
//                   verticalAlign: "middle",
//                   color: "gray",
//                   mr: 0.5,
//                 }}
//               />
//               {study.size}
//             </Typography>
//           </Tooltip>
//         </Box>
//         {/* <Divider></Divider> */}
//         <Divider textAlign="left" sx={{ color: "gray" }}>
//           Descripción
//         </Divider>
//         <Box
//           sx={{
//             margin: "15px",
//           }}
//         >
//           <Typography
//             variant="body2"
//             color="gray"
//             sx={{
//               display: "-webkit-box",
//               WebkitLineClamp: 3,
//               WebkitBoxOrient: "vertical",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               minHeight: "3.2em", // <-- Mantiene altura aunque solo haya 1 línea
//             }}
//           >
//             {study.description}
//           </Typography>
//         </Box>

//         <Divider textAlign="left" sx={{ color: "gray" }}>
//           Dimensiones
//         </Divider>

//         <Box
//           sx={{
//             margin: "15px",
//             display: "flex",
//             gap: 1,
//             // justifyContent: "center", // Centrar contenido
//             flexWrap: "wrap",
//           }}
//         >
//           {/* <ChipsArray items={["Caja 1", "Caja 2", "Caja 3"]} /> */}

//           {study.dimensions?.map((dim) => (
//             <Box
//               key={dim.id_dimension}
//               // elevation={3}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 // backgroundColor: "#2563eb",
//                 backgroundColor: 'rgba(37, 100, 235, 0.1)',
//                 padding: "7px",
//                 borderRadius: "50px",
//                 minWidth: "50px",
//               }}
//             >
//               <Tooltip title={dim.name}>
//                 <Typography
//                   variant="body2"
//                   color="gray"
//                   sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                 >
//                   {dim.initial}
//                 </Typography>
//               </Tooltip>
//             </Box>
//           ))}
//         </Box>

//         {/* <Divider> </Divider> */}

//         {/* <Box
//           sx={{
//             margin: "15px",
//           }}
//         >
//           {/* Botón para generar la tabla antropométrica */}
//         {/* <Button
//             variant="contained"
//             onClick={() => handleOpenTableDialog(study)}
//           >
//             Generar Tabla
//           </Button>
//           {/* <Button onAction={handleClick()}>Tabla {">"}</Button> */}
//         {/* </Box> */}
//       </CardContent>
//       {/* </CardActionArea> */}
//     </Card>
//   );
// };
// export default CardStudy;

// import React, { useCallback, memo } from "react";
// import { StudyData } from "../../types";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Tooltip,
//   Divider,
//   Box,
//   Stack,
// } from "@mui/material";
// import useNavigation from "../../hooks/useNavigation";
// import LongMenu from "../Menu";
// import {
//   LocationOnOutlined as LocationIcon,
//   GroupsOutlined as GroupsIcon,
//   CalendarMonthOutlined as CalendarIcon,
//   Add as AddIcon,
// } from "@mui/icons-material";
// import { deleteData } from "../../service/service";

// interface Props {
//   study: StudyData;
//   selected: boolean;
//   onSelect: () => void;
//   onEdit: (study: StudyData) => void;
//   onViewMeasurements: (study: StudyData) => void;
//   onOpenTable: (study: StudyData) => void;
// }

// const CardStudy: React.FC<Props> = ({
//   study,
//   selected,
//   onSelect,
//   onEdit,
//   onViewMeasurements,
//   onOpenTable,
// }) => {
//   const { goToPage } = useNavigation();

//   const handleMenuAction = useCallback(
//     (action: string) => {
//       switch (action) {
//         case "Editar":
//           return onEdit(study);
//         case "Eliminar":
//           study.id && deleteData(study.id);
//           return;
//         case "Ver mediciones":
//           return goToPage(`/studies/${study.id}`, {
//             study,
//           });
//         case "Tablas":
//         default:
//           return onOpenTable(study);
//       }
//     },
//     [study, onEdit, onViewMeasurements, onOpenTable]
//   );

//   return (
//     <Card
//       elevation={0}
//       onClick={onSelect}
//       sx={{
//         width: "100%",
//         height: "100%",
//         border: selected
//           ? "2px solid primary.main"
//           : "1px solid rgba(37,100,235,0.2)",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         transition: "background-color 0.2s",
//         "&:hover": { backgroundColor: "action.hover" },
//       }}

//     >
//       <CardContent
//         sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//           <LongMenu
//             options={["Editar", "Eliminar", "Ver mediciones", "Tablas"]}
//             onAction={handleMenuAction}
//           />
//           <Typography
//             variant="h6"
//             noWrap
//             sx={{ ml: 1, flex: 1, fontWeight: 500 }}
//           >
//             {study.name}
//           </Typography>
//         </Box>

//         <Divider />

//         <Stack spacing={1} mt={1}>
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{ display: "flex", alignItems: "center" }}
//           >
//             <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
//             {study.start_date?.toString()} / {study.end_date?.toString()}
//           </Typography>
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{ display: "flex", alignItems: "center" }}
//           >
//             <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
//             {study.location}, {study.country}
//           </Typography>
//           <Tooltip title="Miembros">
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ display: "flex", alignItems: "center" }}
//             >
//               <GroupsIcon fontSize="small" sx={{ mr: 0.5 }} />
//               {study.size}
//             </Typography>
//             </Tooltip>
//             <Tooltip title="super">
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ display: "flex", alignItems: "center" }}
//             >
//               <GroupsIcon fontSize="small" sx={{ mr: 0.5 }} />
//               Supervisor: {study.supervisor}
//             </Typography>
//           </Tooltip>
//         </Stack>

//         <Divider textAlign="left" sx={{ mt: 2 }}>
//           Descripción
//         </Divider>
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           paragraph
//           sx={{
//             display: "-webkit-box",
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//           }}
//         >
//           {study.description}
//         </Typography>

//         <Divider textAlign="left">Dimensiones</Divider>
//         {/* Uso de Box con gap para separación uniforme tanto en filas como columnas */}
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
//           {study.dimensions?.map((dim) => (
//             <Box
//               key={dim.id_dimension}
//               sx={{
//                 px: 1.5,
//                 py: 0.5,
//                 bgcolor: "primary.light",
//                 borderRadius: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 minWidth: "30px",
//                 // width:`calc(100% - ${study.dimension.legth})`
//               }}
//             >
//               <Tooltip title={dim.name}>
//                 <Typography variant="caption">{dim.initial}</Typography>
//               </Tooltip>
//             </Box>
//           ))}
//         </Box>

//       </CardContent>
//     </Card>
//   );
// };

// export default CardStudy;

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
} from "@mui/material";
import useNavigation from "../../hooks/useNavigation";
import LongMenu from "../Menu";
import {
  LocationOnOutlined as LocationIcon,
  GroupsOutlined as GroupsIcon,
  CalendarMonthOutlined as CalendarIcon,
} from "@mui/icons-material";
import { deleteData } from "../../service/service";

// Helper to decode JWT and get user_id
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

interface Props {
  study: StudyData;
  selected: boolean;
  onSelect: () => void;
  onEdit: (study: StudyData) => void;
  onViewMeasurements: (study: StudyData) => void;
  onOpenTable: (study: StudyData) => void;
}

const CardStudy: React.FC<Props> = memo(
  ({ study, selected, onSelect, onEdit, onViewMeasurements, onOpenTable }) => {
    const { goToPage } = useNavigation();

    // Extract current user ID and role from token
    const token = localStorage.getItem("access_token") || "";
    const payload: any = token ? parseJwt(token) : null;
    const currentUserId = payload?.user_id;
    const currentUserRole = payload?.role;

    // Determine if current user is supervisor or admin
    const isOwner = currentUserId === study.supervisor;
    const isAdmin = currentUserRole === "admin";

    const handleMenuAction = useCallback(
      (action: string) => {
        switch (action) {
          case "Editar":
            return onEdit(study);
          case "Eliminar":
            study.id && deleteData(study.id);
            return;
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

          <Stack spacing={1} mt={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
              {study.start_date ? study.start_date.toString() : ""} / {study.end_date ? study.end_date.toString() : ""}
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
                {study.size}
              </Typography>
            </Tooltip>
          </Stack>

          <Divider textAlign="left" sx={{ mt: 2 }}>
            Descripción
          </Divider>
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
    );
  }
);

export default CardStudy;
