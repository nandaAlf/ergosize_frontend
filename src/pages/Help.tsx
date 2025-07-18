import React, { useState, useMemo } from "react";
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
  Drawer,
  IconButton,
  useMediaQuery,
  Theme,
  AppBar,
  Toolbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { useSearchParams } from "react-router-dom";
import helpDataDimension from "../utils/helpDataDimension.json";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface DimensionDetail {
  sigla: string;
  definition: string;
  vestuario: string;
  posicion: string;
  unidad: string;
  instrumento: string;
  graphic: string;
}

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const handleCategoryChange = (cat: string | null) => {
    setCategory((prev) => (prev === cat ? null : cat));
  };

  const handleSelectItem = (item: string) => {
    setItem(item);
    if (isMobile) setMobileOpen(false); // Cierra el drawer al seleccionar en móvil
  };

  const detail = useMemo<DimensionDetail | null>(() => {
    if (!selectedCategory || !selectedItem) return null;
    const category = selectedCategory as keyof typeof helpDataDimension;
    const categoryData = helpDataDimension[category];
    const itemKey = selectedItem as keyof typeof categoryData.items;
    return categoryData?.items?.[itemKey] || null;
  }, [selectedCategory, selectedItem]);

  const images = detail ? normalizeGraphic(detail.graphic) : [];

  const shouldShowSection = (value?: string) => {
    return value && value.trim() !== "";
  };

  // ===== Drawer para móviles =====
  const drawer = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        borderRight: "1px solid #eee",
        overflowY: "auto",
          bgcolor: "background.paper", 
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
                selectedCategory === catKey ? "bg.paper" : "inherit",
              "&:hover": { bgcolor: "bg.paper" },
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
                      // backgroundColor: "primary.light",
                    },
                  }}
                >
                  <ListItemText primary={it} />
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* AppBar solo para móviles */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Dimensiones</Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer para móviles */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }} // Mejor rendimiento en móvil
        sx={{
          width: isMobile ? 280 : "auto",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? 280 : "auto",
            boxSizing: "border-box",
            position: "relative",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: "auto",
          p: isMobile ? 3 : 2,
          pt: isMobile ? "64px" : 2, // Ajuste para AppBar en móvil
        }}
      >
        {!detail ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="textSecondary">
              Selecciona una dimensión
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            {/* Información textual - Ahora arriba en móvil */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                order: { xs: 2, md: 1 },
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {selectedItem}
                  {detail.sigla && ` (${detail.sigla})`}
                </Typography>
                <Divider />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {shouldShowSection(detail.definition) && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      Vestuario
                    </Typography>
                    <Typography variant="body1">{detail.vestuario}</Typography>
                  </Box>
                )}
                {shouldShowSection(detail.definition) && (
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
                {shouldShowSection(detail.definition) && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      Intrumento
                    </Typography>
                    <Typography variant="body1">
                      {detail.instrumento}
                    </Typography>
                  </Box>
                )}
                {shouldShowSection(detail.definition) && (
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

                {/* ... (otros campos igual que antes) ... */}
              </Box>
            </Paper>

            {/* Galería de imágenes - Ahora abajo en móvil */}
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: 400 },
                p: 3,
                borderRadius: 2,
                order: { xs: 1, md: 2 },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Representación
              </Typography>

              {images.length > 0 ? (
                images.map((img, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box
                      component="img"
                      src={`imagenes_dimensiones/${img}`}
                      alt={`${selectedItem} - Imagen ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: { xs: "auto", md: "70vh" },
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 4,
                  }}
                >
                  <ImageNotSupportedOutlinedIcon
                    sx={{ fontSize: 48, color: "text.secondary" }}
                  />
                  <Typography color="textSecondary">No hay imágenes</Typography>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
