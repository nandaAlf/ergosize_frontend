import React from 'react';
import { Box, Typography } from '@mui/material';

interface AnnotatedImageProps {
  src: string;                   // URL de la imagen
  measurements: {
    /** posición en % dentro de la imagen */
    xPct: number;  
    yPct: number;
    /** valor a mostrar */
    label: string;
  }[];
  width?: number; // ancho deseado en px
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({
  src,
  measurements,
  width = 400,
}) => (
  <Box
    sx={{
      position: 'relative',
      width,
      height: 'auto',
      '& img': { display: 'block', width: '100%', height: 'auto' },
    }}
  >
    {/* Imagen base */}
    <img src={src} alt="Antropométrica" />

    {/* Overlay de mediciones */}
    {measurements.map((m, i) => (
      <Typography
        key={i}
        variant="caption"
        sx={{
          position: 'absolute',
          top: `${m.yPct}%`,
          left: `${m.xPct}%`,
          transform: 'translate(-50%, -100%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          p: '2px 4px',
          borderRadius: 1,
          pointerEvents: 'none',
        }}
      >
        {m.label}
      </Typography>
    ))}
  </Box>
);
