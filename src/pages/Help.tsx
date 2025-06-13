import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSearchParams } from "react-router-dom";
// Asegúrate de que la ruta sea correcta
import helpDataDimension from "../utils/helpDataDimension.json";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// Define la estructura esperada para los detalles de una dimensión individual
interface DimensionDetail {
  sigla: string;
  definition: string;
  vestuario: string;
  posicion: string;
  umidad: string;
  instrumento: string;
  graphic: string;
}

// 2. Función para normalizar campo 'graphic'
const normalizeGraphic = (graphic: string | string[] | undefined): string[] => {
  if (!graphic) return [];
  if (Array.isArray(graphic)) return graphic;
  return [graphic];
};

export default function HelpMenu() {
  const [searchParams] = useSearchParams();
  const itemParam = searchParams.get("item");
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setCategory] = useState<string | null>(
    categoryParam
  );
  const [selectedItem, setItem] = useState<string | null>(itemParam);

  const handleCategoryChange = (cat: string | null) => {
    setCategory((prev) => (prev === cat ? null : cat));
  };

  const handleSelectItem = (item: string) => {
    setItem(item);
  };

  // const detail = useMemo<DimensionDetail | null>(() => {
  //   if (!selectedCategory || !selectedItem) return null;
  //   const catData = helpDataDimension[selectedCategory as keyof typeof helpDataDimension];
  //   return catData?.items?.[selectedItem] || null;
  // }, [selectedCategory, selectedItem]);

  const detail = useMemo<DimensionDetail | null>(() => {
    if (!selectedCategory || !selectedItem) return null;

    const category = selectedCategory as keyof typeof helpDataDimension;
    const categoryData = helpDataDimension[category];

    if (!categoryData?.items?.[selectedItem]) return null;

    return categoryData.items[selectedItem];
  }, [selectedCategory, selectedItem]);
  // 3. Normalizar imágenes siempre a array
  const images = detail ? normalizeGraphic(detail.graphic) : [];

  // 4. Función para verificar si mostrar sección
  const shouldShowSection = (value?: string) => {
    return value && value.trim() !== "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        // position: "fixed",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
      }}
    >
      {/* Panel izquierdo - Menú de navegación */}
      <Box
        sx={{
          width: 300,
          height: "100%",
          borderRight: "1px solid #eee",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 1,
          zIndex: 1,
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dimensiones Antropométricas
          </Typography>
        </Box>

        {Object.keys(helpDataDimension).map((catKey) => (
          <Accordion
            key={catKey}
            disableGutters
            expanded={selectedCategory === catKey}
            onChange={(_, expanded) =>
              handleCategoryChange(expanded ? catKey : null)
            }
            sx={{
              "&:before": { display: "none" },
              boxShadow: "none",
              borderBottom: "1px solid #f5f5f5",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor:
                  selectedCategory === catKey ? "action.selected" : "inherit",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>{catKey}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {Object.keys(
                  helpDataDimension[catKey as keyof typeof helpDataDimension]
                    ?.items || {}
                ).map((it) => (
                  <ListItemButton
                    key={it}
                    selected={selectedItem === it}
                    onClick={() => handleSelectItem(it)}
                    sx={{
                      pl: 3,
                      py: 1,
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                      "&.Mui-selected": {
                        backgroundcolor: "primary.light",
                        "&:hover": { backgroundcolor: "primary.light" },
                      },
                    }}
                  >
                    <ListItemText
                      primary={it}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Panel derecho - Detalle de la dimensión */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        {!detail ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="textSecondary">
              Selecciona una dimensión para ver la ayuda
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Información textual */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2, maxWidth: "60%" }}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 2, height: "100%" }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedItem}
                    {/* 5. Manejar sigla opcional */}
                    {detail.sigla &&
                      detail.sigla.trim() !== "" &&
                      ` (${detail.sigla})`}
                  </Typography>
                  <Divider />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* 6. Mostrar secciones solo si tienen contenido */}
                  {shouldShowSection(detail.definition) && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Definición
                      </Typography>
                      <Typography variant="body1">
                        {detail.definition}
                      </Typography>
                    </Box>
                  )}

                  {shouldShowSection(detail.vestuario) && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Vestuario
                      </Typography>
                      <Typography variant="body1">
                        {detail.vestuario}
                      </Typography>
                    </Box>
                  )}

                  {shouldShowSection(detail.posicion) && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Posición
                      </Typography>
                      <Typography variant="body1">{detail.posicion}</Typography>
                    </Box>
                  )}

                  {shouldShowSection(detail.instrumento) && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                        Instrumento
                      </Typography>
                      <Typography variant="body1">
                        {detail.instrumento}
                      </Typography>
                    </Box>
                  )}
                  {shouldShowSection(detail.unidad) && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Unidad de medida
                      </Typography>
                      <Typography variant="body1">{detail.unidad}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Galería de imágenes */}
            <Box
              sx={{
                width: 400,
                height: "100%",
                overflowY: "hidden",
                bgcolor: "transparent",
                borderLeft: "1px solid #eee",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                p: 3,
                mt: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Referencia Visual
              </Typography>

              {images.length > 0 ? (
                images.map((img, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box
                      component="img"
                      // 7. Manejar rutas de imágenes con base segura
                      src={`imagenes_dimensiones/${img}`}
                      alt={`${selectedItem} - Imagen ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "70vh",
                        objectFit: "contain",
                        borderRadius: 1,
                        boxShadow: 2,
                      }}
                      // 8. Manejo de errores de carga
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, display: "block", textAlign: "center" }}
                    >
                      Figura {index + 1}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "text.secondary",
                  }}
                >
                  <ImageNotSupportedOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>No hay imágenes disponibles</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
