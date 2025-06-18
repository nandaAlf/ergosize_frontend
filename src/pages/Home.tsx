import * as React from "react";
import { Suspense } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
  IconButton,
  CircularProgress,
} from "@mui/material";

import Fade from "@mui/material/Fade";
import { Slide } from "@mui/material";
// import ManiquiViewer from "../components/ManiquiViewer";
const ManiquiViewer = React.lazy(() => import("../components/ManiquiViewer"));
import {
  People,
  BarChart,
  Public,
  Description,
  CloudUpload,
  ArrowForward,
  Science,
} from "@mui/icons-material";
import useNavigation from "../hooks/useNavigation";
// import AuthPage from "./AuthPage";

const Home: React.FC = () => {
  const theme = useTheme();
  const { goToPage } = useNavigation();
  const handleDimensionHelpClick = () => goToPage(`/help`);


  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        // background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
        background:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        pt: 4,
        pb: 8,
        pl: 4,
      }}
    >
      <Container maxWidth="xl">
\
        {/* Hero Section */}
        <Slide direction="right" in={true} timeout={1000}>
          <Grid container spacing={4} alignItems="center" sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Gestión y consulta de <br />
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.primary.main,
                    position: "relative",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "8px",
                      background: `linear-gradient(90deg, ${theme.palette.primary.light}, transparent)`,
                      borderRadius: "4px",
                    },
                  }}
                >
                  datos antropométricos
                </Box>
              </Typography>

              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.7,
                  maxWidth: "90%",
                }}
              >
                Ergosizes es la solución definitiva para consultar información
                antropométrica de diferentes poblaciones de manera eficiente,
                precisa y segura.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: "10px",
                    boxShadow: theme.shadows[4],
                    "&:hover": {
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={handleDimensionHelpClick}
                >
                  Consultar Dimensiones
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<CloudUpload />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: "10px",
                    borderWidth: "2px",
                    "&:hover": {
                      borderWidth: "2px",
                    },
                  }}
                >
                  Subir Datos
                </Button>
              </Stack>

              <Grid container spacing={2} sx={{ mt: 4 }}>
                {[
                  {
                    icon: <People fontSize="large" />,
                    value: "500+",
                    label: "Estudios",
                  },
                  {
                    icon: <Public fontSize="large" />,
                    value: "300+",
                    label: "Poblaciones",
                  },
                  {
                    icon: <BarChart fontSize="large" />,
                    value: "2M+",
                    label: "Mediciones",
                  },
                ].map((stat, index) => (
                  <Grid key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        minWidth: "250px",
                        background:
                          theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
                        boxShadow: theme.shadows[2],
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "50%",
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={6}
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "500px",
                  position: "relative",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    // background: "linear-gradient(45deg, #e0f7fa, #bbdefb)",
                    background:
                      theme.palette.mode === "dark"
                        ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
                        : "linear-gradient(45deg, #e0f7fa, #bbdefb)",

                    transition: "all 0.3s ease",
                    // background: `linear-gradient(45deg, #e0f7fa, #bbdefb)`,
                  }}
                />
                <Suspense fallback={<CircularProgress />}>
                  <ManiquiViewer />
                </Suspense>
              </Paper>
            </Grid>
          </Grid>
        </Slide>
        {/* Features Section */}
        {/* <Fade> */}
        <Fade in={true} timeout={1200}>
        {/* <Slide direction="up" in={true} timeout={1500}> */}
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 6,
              color: theme.palette.text.primary,
            }}
          >
            ¿Por qué elegir Ergosizes?
          </Typography>
          </Fade>
        {/* </Slide> */}
        <Slide direction="up" in={true} timeout={1500}>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {[
              {
                icon: <Science fontSize="large" />,
                title: "Precisión Científica",
                description:
                  "Datos antropométricos recopilados con rigurosos estándares científicos y validados por expertos.",
              },
              {
                icon: <Description fontSize="large" />,
                title: "Informes Personalizados",
                description:
                  "Genera informes detallados con análisis estadísticos y visualizaciones personalizadas.",
              },
              {
                icon: <BarChart fontSize="large" />,
                title: "Comparaciones Avanzadas",
                description:
                  "Compara datos entre diferentes poblaciones, grupos demográficos y períodos históricos.",
              },
              {
                icon: <CloudUpload fontSize="large" />,
                title: "Integración Sencilla",
                description:
                  "Sube tus propios datos en múltiples formatos para enriquecer nuestra base de datos.",
              },
            ].map((feature, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: "16px",
                    background:
                      theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
                    boxShadow: theme.shadows[3],
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Slide>
        {/* </Fade> */}
        {/* CTA Section */}
        <Paper
          sx={{
            p: 6,
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "#fff",
            textAlign: "center",
            // color: theme.palette.primary.contrastText,
            mb: 8,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 2, fontWeight: 700 }}
          >
            Comienza hoy mismo tu análisis antropométrico
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, maxWidth: "700px", mx: "auto" }}
          >
            Únete a miles de investigadores, diseñadores y profesionales de la
            salud que ya usan Ergosizes
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: "12px",
              boxShadow: theme.shadows[6],
              "&:hover": {
                boxShadow: theme.shadows[10],
                bgcolor: theme.palette.secondary.dark,
              },
            }}
           onClick={()=>goToPage("auth?mode=register")}
          >
            Registrarse Gratis
          </Button>
        </Paper>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 4,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Ergosizes. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={1}>
            {["Instagram", "Twitter", "LinkedIn"].map((network) => (
              <IconButton key={network} size="small">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {network}
                </Typography>
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
export default Home;
