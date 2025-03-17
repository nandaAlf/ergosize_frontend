// import TarjetaPoblacion from "../components/card/card2";
import { useTheme, useMediaQuery } from "@mui/material";
// import { Grid2 } from '@mui/material/Unstable_Grid2'; // Importar Grid2
// import { useInView } from 'react-intersection-observer';
// import { motion } from 'framer-motion';
import Grid from "@mui/material/Grid2";
import TarjetaPoblacion from "../components/card/card2";
import Filtros from "../components/filtros/filter";

interface InformacionTarjeta {
  id: number;
  nombre: string;
  sexo: string;
  tipoPoblacion: string;
  rangoEdad: string;
  region: string;
  pais: string;
  muestra: number;
  dimensiones: string[];
  fechaInicio: string;
  fechaFin: string;
}

const informaciones: InformacionTarjeta[] = [
  {
    id:1,
    nombre: "Población laboral europea",
    sexo: "mixto",
    tipoPoblacion: "adultos",
    rangoEdad: "20-60",
    region: "Europa",
    pais: "Alemania",
    muestra: 400,
    dimensiones: [
      "altura",
      "peso",
      "diámetro del pie",
      "longitud del brazo",
      "circunferencia de la cintura",
      "etc...",
    ],
    fechaInicio: "2023-01-01",
    fechaFin: "2023-12-31",
  },
  {
    id:2,
    nombre: "Población laboral europea",
    sexo: "mixto",
    tipoPoblacion: "adultos",
    rangoEdad: "20-60",
    region: "Europa",
    pais: "Alemania",
    muestra: 400,
    dimensiones: [
      "altura",
      "peso",
      "diámetro del pie",
      "longitud del brazo",
      "circunferencia de la cintura",
      "etc...",
    ],
    fechaInicio: "2023-01-01",
    fechaFin: "2023-12-31",
  },
  {
    id:3,
    nombre: "Población estudiantil latinoamericana",
    sexo: "mixto",
    tipoPoblacion: "jóvenes",
    rangoEdad: "15-25",
    region: "América Latina",
    pais: "México",
    muestra: 300,
    dimensiones: ["altura", "peso", "circunferencia de la cabeza", "etc..."],
    fechaInicio: "2023-02-01",
    fechaFin: "2023-11-30",
  },
  {
    id:4,
    nombre: "Población laboral europea",
    sexo: "mixto",
    tipoPoblacion: "adultos",
    rangoEdad: "20-60",
    region: "Europa",
    pais: "Alemania",
    muestra: 400,
    dimensiones: [
      "altura",
      "peso",
      "diámetro del pie",
      "longitud del brazo",
      "circunferencia de la cintura",
      "etc...",
    ],
    fechaInicio: "2023-01-01",
    fechaFin: "2023-12-31",
  },
  {
    id:5,
    nombre: "Población laboral europea",
    sexo: "mixto",
    tipoPoblacion: "adultos",
    rangoEdad: "20-60",
    region: "Europa",
    pais: "Alemania",
    muestra: 400,
    dimensiones: [
      "altura",
      "peso",
      "diámetro del pie",
      "longitud del brazo",
      "circunferencia de la cintura",
      "etc...",
    ],
    fechaInicio: "2023-01-01",
    fechaFin: "2023-12-31",
  },
  {
    id:6,
    nombre: "Población estudiantil latinoamericana",
    sexo: "mixto",
    tipoPoblacion: "jóvenes",
    rangoEdad: "15-25",
    region: "América Latina",
    pais: "México",
    muestra: 300,
    dimensiones: ["altura", "peso", "circunferencia de la cabeza", "etc..."],
    fechaInicio: "2023-02-01",
    fechaFin: "2023-11-30",
  },
  // Agrega más objetos aquí
];

const Tables: React.FC = () => {
  const functions = () => {
    console.log("hola");
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <>
      <Filtros onFiltrar={functions}></Filtros>
      <Grid container spacing={2} sx={{ padding: "5px" , backgroundColor:"#f0f0f0ff"}}>
        {informaciones.map((info, index) => (
          // <Grid key={index} xs={12} sm={isMobile ? 12 : isTablet ? 6 : 4}>
          <TarjetaPoblacion informacion={info} />
          // </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Tables;
