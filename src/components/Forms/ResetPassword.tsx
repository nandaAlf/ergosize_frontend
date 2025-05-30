/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import ApiService from "../../api/ApiService";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await ApiService.post("/accounts/password/reset/confirm/", {
        uidb64,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/login"), 2000); // redirige tras éxito
    } catch (e: any) {
      const detail =
        e.response?.data?.detail ||
        e.response?.data?.token?.join(", ") ||
        "No se pudo restablecer la contraseña.";
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
      <Typography variant="h5">Restablecer contraseña</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        label="Nueva contraseña"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
      />
      <TextField
        label="Confirmar contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Cambiar contraseña
      </Button>
    </Box>
  );
};

export default ResetPasswordPage;
