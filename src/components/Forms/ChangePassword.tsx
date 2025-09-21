// /* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { 
  Box, TextField, Button, Alert, Typography, 
  Paper,  Fade, InputAdornment, IconButton, 
  useTheme, CircularProgress, Container,
  Link
} from "@mui/material";
import { 
  Lock, Visibility, VisibilityOff, 
  LockReset, CheckCircle 
} from "@mui/icons-material";
import ApiService from "../../api/ApiService";

const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  const theme = useTheme();

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
      setSuccess("¡Contraseña actualizada correctamente!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      const data = e.response?.data;
      setError(
        data?.non_field_errors?.[0] ||
        data?.old_password?.[0] ||
        data?.new_password?.[0] ||
        data?.detail ||
        "Error al cambiar la contraseña. Por favor, verifica tus datos."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
          background: "linear-gradient(135deg, backgroud.paper 0%, #e4edf5 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: theme.shadows[10],
            background: theme.palette.background.paper,
          }}
        >
          {/* Header con gradiente */}
          <Box
            sx={{
              py: 4,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <LockReset sx={{ fontSize: 60, mb: 2 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Cambiar Contraseña
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Protege tu cuenta con una contraseña segura
            </Typography>
          </Box>
          
          {/* Contenido del formulario */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                variant="h6" 
                color="text.secondary"
              >
                Ingresa tu contraseña actual y establece una nueva
              </Typography>
            </Box>
            
            <Fade in={!!error} unmountOnExit>
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: '10px' }}
              >
                {error}
              </Alert>
            </Fade>
            
            <Fade in={!!success} unmountOnExit>
              <Alert 
                severity="success" 
                icon={<CheckCircle fontSize="inherit" />}
                sx={{ mb: 3, borderRadius: '10px' }}
              >
                {success}
              </Alert>
            </Fade>
            
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2 
              }}
            >
              <TextField
                label="Contraseña actual"
                type={showPassword.old ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('old')}
                        edge="end"
                      >
                        {showPassword.old ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
              />
              
              <TextField
                label="Nueva contraseña"
                type={showPassword.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
                helperText="Mínimo 8 caracteres, incluyendo números y letras"
              />
              
              <TextField
                label="Confirmar nueva contraseña"
                type={showPassword.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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
                  borderRadius: '10px',
                    fontWeight: 700,
                  fontSize: '1rem',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                  }
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockReset />}
              >
                {loading ? "Guardando cambios..." : "Actualizar contraseña"}
              </Button>
            </Box>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿Necesitas ayuda? <Link href="/support" sx={{ fontWeight: 600 }}>Contáctanos</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Typography 
          variant="body2" 
          color="textSecondary" 
          align="center" 
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Ergosizes. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;