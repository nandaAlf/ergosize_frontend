import * as React from "react";
import { Box, Typography, Link, Stack,IconButton } from "@mui/material";

const Footer: React.FC = () => {
  return (
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
