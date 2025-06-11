/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

// const ResetPasswordPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const uidb64 = searchParams.get("uidb64");
//   const token = searchParams.get("token");

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     setError(null);
//     if (newPassword !== confirmPassword) {
//       setError("Las contraseñas no coinciden.");
//       return;
//     }

//     try {
//       await ApiService.post("/accounts/password/reset/confirm/", {
//         uidb64,
//         token,
//         new_password: newPassword,
//         confirm_password: confirmPassword,
//       });
//       setSuccess("Contraseña actualizada correctamente.");
//       setTimeout(() => navigate("/login"), 2000); // redirige tras éxito
//     } catch (e: any) {
//       const detail =
//         e.response?.data?.detail ||
//         e.response?.data?.token?.join(", ") ||
//         "No se pudo restablecer la contraseña.";
//       setError(detail);
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       gap={2}
//       width={300}
//       mx="auto"
//       mt={8}
//     >
//       <Typography variant="h5">Restablecer contraseña</Typography>

//       {error && <Alert severity="error">{error}</Alert>}
//       {success && <Alert severity="success">{success}</Alert>}

//       <TextField
//         label="Nueva contraseña"
//         type="password"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         fullWidth
//       />
//       <TextField
//         label="Confirmar contraseña"
//         type="password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         fullWidth
//       />
//       <Button variant="contained" onClick={handleSubmit} fullWidth>
//         Cambiar contraseña
//       </Button>
//     </Box>
//   );
// };

// export default ResetPasswordPage;
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async () => {
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!uidb64 || !token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    setLoading(true);
    try {
      await ApiService.post("/accounts/password/reset/confirm/", {
        uidb64,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e: any) {
      const detail =
        e.response?.data?.detail ||
        e.response?.data?.token?.join(", ") ||
        "No se pudo restablecer la contraseña.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        p: 2,
      }}
    >
      <Grid container justifyContent="center">
        <Grid  size={{xs:12 , sm:10, md:8 ,lg:12}}>
       
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
                Restablece tu contraseña
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                Crea una nueva contraseña segura para tu cuenta
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
                <Lock sx={{ fontSize: 100 }} />
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
                  Nueva Contraseña
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Crea una contraseña segura para tu cuenta
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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Nueva Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                />

                <TextField
                  label="Confirmar Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
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
                    "Cambiar Contraseña"
                  )}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/login")}
                    sx={{ fontWeight: 600 }}
                  >
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

export default ResetPasswordPage;