import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api/ApiService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await ApiService.login(username, password);
      navigate('/');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Error de autenticación');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} width={300} mx="auto" mt={8}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default Login;
