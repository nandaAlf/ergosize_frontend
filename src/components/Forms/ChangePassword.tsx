/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ChangePasswordPage.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import ApiService from "../../api/ApiService";
// import ApiService from "../api/ApiService";

const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await ApiService.post("accounts/password/change/", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess("Contraseña actualizada correctamente.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      const data = e.response?.data;
      setError(
        data.non_field_errors?.[0] ||
          //   data.old_password?.[0] ||
          // data.new_password?.[0] ||
          // data.confirm_password?.[0] ||
          // data.detail    ||
          "Error al cambiar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cambiar contraseña
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        label="Contraseña actual"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        label="Nueva contraseña"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        label="Confirmar nueva contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </Box>
  );
};

export default ChangePasswordPage;
