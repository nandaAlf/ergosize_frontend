/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import { TextField, Button, Box, Alert } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import ApiService from '../../api/ApiService';

// const Login: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     try {
//       await ApiService.login(username, password);
//       navigate('/');
//     } catch (e: any) {
//       setError(e.response?.data?.detail || 'Error de autenticación');
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" gap={2} width={300} mx="auto" mt={8}>
//       {error && <Alert severity="error">{error}</Alert>}
//       <TextField
//         label="Usuario"
//         value={username}
//         onChange={e => setUsername(e.target.value)}
//         fullWidth
//       />
//       <TextField
//         label="Contraseña"
//         type="password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         fullWidth
//       />
//       <Button variant="contained" onClick={handleSubmit} fullWidth>
//         Iniciar sesión
//       </Button>
//     </Box>
//   );
// };

// export default Login;

import React, { useState } from "react";

// import ApiService from '../api/ApiService';
import ApiService from "../../api/ApiService";

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
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
// import { useNavigate } from "react-router-dom";g
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Badge,
  Login,
  HowToReg,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import useNavigation from "../../hooks/useNavigation";
import { useAuth } from "../../context/AuthContext";
const LoginForm: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMode =
    queryParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  // const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  // const navigate = useNavigate();
  const { goToPage } = useNavigation();
  const theme = useTheme();

  const clear = () => {
    setError(null);
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setShowPassword(false);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!username || !password) {
          setError("Por favor, complete todos los campos.");
          setIsLoading(false);
          return;
        }
        const userToken = await ApiService.login(username, password);
        const userData = await ApiService.get("accounts/users/me/");
        console.log("User data fetched successfully 55:", userData);
        setUser(userData.data);
      } else {
        await ApiService.post("/accounts/users/", {
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
          role: "usuario",
          institucion: "",
          profesion: "",
        });
        await ApiService.login(username, password);
      }

      setIsLoading(false);
      // navigate("/");
      goToPage("/");
    } catch (e: any) {
      setIsLoading(false);
      const detail =
        e.response?.data?.detail ||
        e.response?.data?.username?.join(", ") ||
        e.response?.data?.email?.join(", ") ||
        "Error de autenticación";
      setError(detail);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
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
        <Grid size={{ xs: 12, sm: 10, md: 8, lg: 12 }}>
          {/* // xs={12} sm={10} md={8} lg={6} */}

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
                {mode === "login"
                  ? "Bienvenido de nuevo"
                  : "Únete a nuestra comunidad"}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {mode === "login"
                  ? "Accede a la plataforma líder en datos antropométricos"
                  : "Crea tu cuenta y comienza a explorar nuestra base de datos"}
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
                <Person sx={{ fontSize: 100 }} />
              </Box>
            </Box>

            {/* Right Panel - Form */}
            <Box
              sx={{
                flex: 1,
                p: 4,
                backgroundColor: theme.palette.background.paper,
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
                  {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {mode === "login"
                    ? "Ingresa tus credenciales para continuar"
                    : "Completa tus datos para registrarte"}
                </Typography>
              </Box>

              <Fade in={!!error} unmountOnExit>
                <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                  {error}
                </Alert>
              </Fade>

              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
                onKeyPress={handleKeyPress}
              >
                {mode === "register" && (
                  <>
                    <TextField
                      label="Nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      size="medium"
                    />

                    <TextField
                      label="Apellido"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      size="medium"
                    />
                  </>
                )}

                <TextField
                  label="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle
                          sx={{ color: theme.palette.primary.main }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                />

                {mode === "register" && (
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
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
                )}

                <TextField
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  fullWidth
                  size="large"
                  disabled={isLoading}
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
                  startIcon={mode === "login" ? <Login /> : <HowToReg />}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : mode === "login" ? (
                    "Entrar"
                  ) : (
                    "Registrar"
                  )}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode(mode === "login" ? "register" : "login");
                      clear();
                    }}
                    sx={{ fontWeight: 600 }}
                  >
                    {mode === "login"
                      ? "¿No tienes cuenta? Regístrate"
                      : "¿Ya tienes cuenta? Inicia sesión"}
                  </Link>
                </Box>

                {mode === "login" && (
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <Link
                      component="button"
                      variant="body2"
                      // onClick={() => navigate("/forgot-password")}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage("/forgot-password");
                      }}
                      sx={{ fontWeight: 600 }}
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Box>
                )}

                <Divider sx={{ my: 3 }}>o continúa con</Divider>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50%",
                      minWidth: "auto",
                      width: "50px",
                      height: "50px",
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <Box
                      component="img"
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="Google"
                      sx={{ width: 24, height: 24 }}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50%",
                      minWidth: "auto",
                      width: "50px",
                      height: "50px",
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <Box
                      component="img"
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg"
                      alt="Microsoft"
                      sx={{ width: 24, height: 24 }}
                    />
                  </Button>
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

export default LoginForm;

// const LoginForm: React.FC = () => {
//   const [mode, setMode] = useState<"login" | "register">("login");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate();

//   const clear = () => {
//     setError(null);
//     setUsername("");
//     setPassword("");
//     setEmail("");
//     setFirstName("");
//     setLastName("");
//   };

//   const handleSubmit = async () => {
//     setError(null);
//     try {
//       if (mode === "login") {
//         await ApiService.login(username, password);
//       } else {
//         // Registro: crea usuario y luego hace login
//         await ApiService.post("/accounts/users/", {
//           username,
//           password,
//           email,
//           first_name: firstName,
//           last_name: lastName,
//           role: "usuario", // fuerza rol básico
//           institucion: "",
//           profesion: "",
//         });
//         // Tras registro, logueamos
//         await ApiService.login(username, password);
//       }
//       // ¡disparamos la recarga de perfil!
//       // window.location.reload();
//       navigate("/studies");
//     } catch (e: any) {
//       const detail =
//         e.response?.data?.detail ||
//         e.response?.data?.username?.join(", ") ||
//         e.response?.data?.email?.join(", ") ||
//         "Error de autenticación";
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
//       <Typography variant="h5">
//         {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
//       </Typography>
//       {error && <Alert severity="error">{error}</Alert>}

//       <TextField
//         label="Usuario"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         fullWidth
//       />
//       {mode === "register" && (
//         <>
//           <TextField
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Nombre"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Apellido"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             fullWidth
//           />
//         </>
//       )}
//       <TextField
//         label="Contraseña"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         fullWidth
//       />
//       <Button variant="contained" onClick={handleSubmit} fullWidth>
//         {mode === "login" ? "Entrar" : "Registrar"}
//       </Button>

//       <Box mt={1}>
//         {mode === "login" ? (
//           <>
//             <Typography variant="body2">
//               ¿No tienes cuenta?{" "}
//               <Link
//                 component="button"
//                 onClick={() => {
//                   setMode("register");
//                   clear();
//                 }}
//               >
//                 Regístrate
//               </Link>
//             </Typography>
//             <Box width="100%" textAlign="center">
//               <Link
//                 component="button"
//                 variant="body2"
//                 onClick={() => navigate("/forgot-password")}
//               >
//                 ¿Olvidaste tu contraseña?
//               </Link>
//             </Box>

//           </>
//         ) : (
//           <Typography variant="body2">
//             ¿Ya tienes cuenta?{" "}
//             <Link
//               component="button"
//               onClick={() => {
//                 setMode("login");
//                 clear();
//               }}
//             >
//               Inicia sesión
//             </Link>
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default LoginForm;
