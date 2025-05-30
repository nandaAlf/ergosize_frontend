/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import ApiService from "../../api/ApiService";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <Box maxWidth={400} mx="auto" mt={8} p={3} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Recuperar contraseña
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar "}
        </Button>
      </form>
    </Box>
  );
}
