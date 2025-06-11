/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// import ApiService from "../../api/ApiService";
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
import { useNavigate } from "react-router-dom";
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
import LoginForm from "../components/Forms/Login";
import RegisterForm from "../components/Forms/Register";
import ApiService from "../api/ApiService";


const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const clearForm = () => {
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
        await ApiService.login(username, password);
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
      navigate("/studies");
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
        <Grid size={{ xs:12 ,sm:10, md:8, }} >
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

              {mode === "login" ? (
                // <>
                // </>
                <LoginForm
                //   username={username}
                //   setUsername={setUsername}
                //   password={password}
                //   setPassword={setPassword}
                //   showPassword={showPassword}
                //   togglePasswordVisibility={togglePasswordVisibility}
                //   isLoading={isLoading}
                //   onSubmit={handleSubmit}
                //   onSwitchMode={() => {
                //     setMode("register");
                //     clearForm();
                //   }}
                //   onForgotPassword={() => navigate("/forgot-password")}
                //   onKeyPress={handleKeyPress}
                />
              ) : (
                <RegisterForm
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  email={email}
                  setEmail={setEmail}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                  onSwitchMode={() => {
                    setMode("login");
                    clearForm();
                  }}
                  onKeyPress={handleKeyPress}
                />
              )}
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

export default AuthPage;