import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";
// import { motion } from 'framer-motion';
// Definimos la interfaz para la información de la tarjeta
import PeopleIcon from "@mui/icons-material/People"; // Icono para "Muestra"
import TransgenderIcon from "@mui/icons-material/Transgender"; // Icono para "Sexo"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Icono para "Rango de edad"
import PublicIcon from "@mui/icons-material/Public"; // Icono para "Región"
import FlagIcon from "@mui/icons-material/Flag"; // Icono para "País
import { InformacionTarjeta } from "../../types"; // Importar la interfaz
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom"; // Importar Link
// import { useNavigate } from "react-router-dom"; // Importar useNavigate
import {getData} from "../../api/api"
// Props para el componente TarjetaPoblacion
interface TarjetaPoblacionProps {
  informacion: InformacionTarjeta;
}
import useNavigation from '../../hooks/useNavigation'; 

const TarjetaPoblacion: React.FC<TarjetaPoblacionProps> = ({ informacion }) => {
  const [mostrarDimensiones, setMostrarDimensiones] = useState(false);
  const { goToPage } = useNavigation();
  // const navigate = useNavigate(); // Hook para navegación programática
  function handleClick(): void {
    // navigate(`${informacion.id}/`); // Redirigir a la página de detalle
    alert(`${informacion.id}/`)
   
    goToPage(`${informacion.id}/`)
    // navigateTo(`${informacion.id}/`)
   
  }

  useEffect(() => {
    // Obtener la lista de personas al cargar el componente
    const fetchPersons = async () => {
        try {
            const data = await getData('table/');  // Usar la función getData
           
        } catch (error) {
            // setError(error.message);
        } finally {
            // setLoading(false);
        }
    };

    fetchPersons();
}, []);

  // const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    //   <motion.div
    //     ref={ref}
    //     initial={{ opacity: 0, y: 50 }}
    //     animate={inView ? { opacity: 1, y: 0 } : {}}
    //     transition={{ duration: 0.5 }}
    //   >
    // <Link to={`/table/${informacion.id}`} style={{ textDecoration: 'none', backgroundColor:'red', width:'100vh' }}> {/* Envolver la tarjeta en un Link */}
    <Card sx={{ width: 345, margin: "20px auto" }} onClick={handleClick}>
      <CardContent>
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
          {informacion.nombre}
        </Typography>

        {/* <Divider variant="middle"  /> */}

        <Typography variant="body2" color="text.secondary">
          <strong>Tipo de población:</strong> {informacion.tipoPoblacion}
        </Typography>
        <Tooltip title="Sexo">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TransgenderIcon fontSize="small" /> {informacion.sexo}
          </Typography>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          <strong>Rango de edad:</strong> {informacion.rangoEdad}
        </Typography>

        <Tooltip title="Muestra">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PeopleIcon fontSize="small" /> {informacion.muestra}
          </Typography>
        </Tooltip>

        <Tooltip title="Rango de edad">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarTodayIcon fontSize="small" /> {informacion.fechaInicio} /{" "}
            {informacion.fechaFin}
          </Typography>
        </Tooltip>
        <Tooltip title="Región">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PublicIcon fontSize="small" /> {informacion.region}
          </Typography>
        </Tooltip>

        <Tooltip title="País">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FlagIcon fontSize="small" /> {informacion.pais}
          </Typography>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setMostrarDimensiones(!mostrarDimensiones)}
          sx={{ marginTop: "10px" }}
        >
          {mostrarDimensiones ? "Ocultar dimensiones" : "Mostrar dimensiones"}
        </Button>
        <Collapse in={mostrarDimensiones}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: "10px" }}
          >
            <strong>Dimensiones:</strong>
            <ul>
              {informacion.dimensiones.map((dimension, index) => (
                <li key={index}>{dimension}</li>
              ))}
            </ul>
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
    // {/* //   </motion.div> */}
    //  </Link>
  );
};
export default TarjetaPoblacion;
