/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
// import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import {
  Box,
  TextField,
  Button,
  Alert,
  Link,
  Typography,
  Paper,
  Grid,
  Fade,
  InputAdornment,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ApiService from "../../api/ApiService";


// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccess(null);
//     setError(null);
//     setLoading(true);
//     try {
//       await ApiService.post("/accounts/password/reset/", { email });
//       setSuccess("Revisa tu correo para restablecer tu contraseña.");
//     } catch (err: any) {
//       const detail = err.response?.data?.detail || "Error al enviar el email.";
//       setError(detail);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box maxWidth={400} mx="auto" mt={8} p={3} border="1px solid #ccc" borderRadius={2}>
//       <Typography variant="h6" gutterBottom>
//         Recuperar contraseña
//       </Typography>
//       {success && <Alert severity="success">{success}</Alert>}
//       {error && <Alert severity="error">{error}</Alert>}
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Correo electrónico"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           fullWidth
//           required
//           margin="normal"
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           disabled={loading}
//         >
//           {loading ? "Enviando..." : "Enviar "}
//         </Button>
//       </form>
//     </Box>
//   );
// }
import { Email, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      await ApiService.post("/accounts/password/reset/", { email });
      setSuccess("Revisa tu correo para restablecer tu contraseña.");
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Error al enviar el email.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
          background: "linear-gradient(135deg, backgroud.paper 0%, #e4edf5 100%)",
        p: 2,
      }}
    >
      <Grid container justifyContent="center">
        <Grid size={{xs:12, sm:10, md:8,lg:12  }} >
          <Paper
            elevation={6}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: theme.shadows[10],
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left Panel - Branding */}
            <Box
              sx={{
                flex: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "#fff",
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Ergosizes
              </Typography>

              <Typography variant="h5" sx={{ mb: 2 }}>
                Recupera tu cuenta
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                Te enviaremos un enlace para restablecer tu contraseña
              </Typography>

              <Box
                component="div"
                sx={{
                  mt: 3,
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.8,
                }}
              >
                <Email sx={{ fontSize: 100 }} />
              </Box>
            </Box>

            {/* Right Panel - Form */}
            <Box
              sx={{
                flex: 1,
                p: 4,
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Recuperar contraseña
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Ingresa tu correo electrónico asociado a tu cuenta
                </Typography>
              </Box>

              <Fade in={!!error} unmountOnExit>
                <Alert
                  severity="error"
                  sx={{ mb: 3, borderRadius: "10px" }}
                >
                  {error}
                </Alert>
              </Fade>

              <Fade in={!!success} unmountOnExit>
                <Alert
                  severity="success"
                  sx={{ mb: 3, borderRadius: "10px" }}
                >
                  {success}
                </Alert>
              </Fade>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: theme.shadows[4],
                    "&:hover": {
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Enviar instrucciones"
                  )}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate(-1)}
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowBack sx={{ mr: 1, fontSize: "1rem" }} />
                    Volver al inicio de sesión
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 4 }}
          >
            © {new Date().getFullYear()} Ergosizes. Todos los derechos
            reservados.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPasswordPage;