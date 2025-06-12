import * as React from "react";
import { Box, Typography, Link, Stack,IconButton } from "@mui/material";

const Footer: React.FC = () => {
  return (
    // <Box sx={{ backgroundColor: '#f5f5f5', p: 3, mt: 'auto' }}>
    //   <Typography variant="body1" align="center">
    //     Dirección: Calle Falsa 123, Ciudad, País
    //   </Typography>
    //   <Typography variant="body1" align="center">
    //     Teléfono: +123 456 789
    //   </Typography>
    //   <Typography variant="body1" align="center">
    //     Email: <Link href="mailto:contacto@antropometria.com">contacto@antropometria.com</Link>
    //   </Typography>
    //   <Typography variant="body1" align="center">
    //     Ubicación: <Link href="#" target="_blank">Ver en mapa</Link>
    //   </Typography>
    // </Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pt: 4,
        // borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 Ergosizes. Todos los derechos reservados.
      </Typography>
      <Stack direction="row" spacing={1}>
        {["Instagram", "Twitter", "LinkedIn"].map((network) => (
          <IconButton key={network} size="small">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {network}
            </Typography>
          </IconButton>
        ))}
      </Stack>
    </Box>
  );
};

export default Footer;
