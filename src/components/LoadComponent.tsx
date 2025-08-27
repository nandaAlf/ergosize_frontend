import { Box, CircularProgress } from "@mui/material";

export const FullPageLoader = () => {
//   if (!open) return null;

  return (
    <Box
      sx={{
      // width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      
        backgroundColor: "background.default", // Usa el color de fondo del tema
      }}
    >
      <CircularProgress
        color="inherit" // Hereda el color del contexto (o usa "primary"/"secondary")
        sx={{
          color: "text.primary", // Color de texto del tema (contraste automático)
            mt:-8,
        }}
      />
    </Box>
  );
};
