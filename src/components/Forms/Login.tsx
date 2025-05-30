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
import { Box, TextField, Button, Alert, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import ApiService from '../api/ApiService';
import ApiService from "../../api/ApiService";

const LoginForm: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const clear = () => {
    setError(null);
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      if (mode === "login") {
        await ApiService.login(username, password);
      } else {
        // Registro: crea usuario y luego hace login
        await ApiService.post("/accounts/users/", {
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
          role: "usuario", // fuerza rol básico
          institucion: "",
          profesion: "",
        });
        // Tras registro, logueamos
        await ApiService.login(username, password);
      }
      // ¡disparamos la recarga de perfil!
      // window.location.reload();
      navigate("/");
    } catch (e: any) {
      const detail =
        e.response?.data?.detail ||
        e.response?.data?.username?.join(", ") ||
        e.response?.data?.email?.join(", ") ||
        "Error de autenticación";
      setError(detail);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      width={300}
      mx="auto"
      mt={8}
    >
      <Typography variant="h5">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      {mode === "register" && (
        <>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </>
      )}
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        {mode === "login" ? "Entrar" : "Registrar"}
      </Button>

      <Box mt={1}>
        {mode === "login" ? (
          <>
            <Typography variant="body2">
              ¿No tienes cuenta?{" "}
              <Link
                component="button"
                onClick={() => {
                  setMode("register");
                  clear();
                }}
              >
                Regístrate
              </Link>
            </Typography>
            <Box width="100%" textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
            
          </>
        ) : (
          <Typography variant="body2">
            ¿Ya tienes cuenta?{" "}
            <Link
              component="button"
              onClick={() => {
                setMode("login");
                clear();
              }}
            >
              Inicia sesión
            </Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoginForm;
