import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', p: 3, mt: 'auto' }}>
      <Typography variant="body1" align="center">
        Dirección: Calle Falsa 123, Ciudad, País
      </Typography>
      <Typography variant="body1" align="center">
        Teléfono: +123 456 789
      </Typography>
      <Typography variant="body1" align="center">
        Email: <Link href="mailto:contacto@antropometria.com">contacto@antropometria.com</Link>
      </Typography>
      <Typography variant="body1" align="center">
        Ubicación: <Link href="#" target="_blank">Ver en mapa</Link>
      </Typography>
    </Box>
  );
};

export default Footer;