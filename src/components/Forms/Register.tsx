/* eslint-disable no-unused-vars */

import React, { useState } from "react";
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
// import { useNavigate } from "react-router-dom";
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Badge,
  HowToReg,
} from "@mui/icons-material";

//  Componente para el formulario de Registro
const RegisterForm: React.FC<{
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isLoading: boolean;
  onSubmit: () => void;
  onSwitchMode: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}> = ({
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  showPassword,
  togglePasswordVisibility,
  isLoading,
  onSubmit,
  onSwitchMode,
  onKeyPress,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      onKeyPress={onKeyPress}
    >
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

      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle sx={{ color: theme.palette.primary.main }} />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="medium"
      />

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
              <IconButton onClick={togglePasswordVisibility} edge="end">
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
        onClick={onSubmit}
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
        startIcon={<HowToReg />}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Registrar"
        )}
      </Button>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Link
          component="button"
          variant="body2"
          onClick={onSwitchMode}
          sx={{ fontWeight: 600 }}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </Box>

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
  );
};

export default RegisterForm