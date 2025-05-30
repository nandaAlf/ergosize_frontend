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

// Define la estructura esperada para los detalles de una dimensión individual
interface DimensionDetail {
  sigla: string;
  definition: string;
  vestuario: string;
  posicion: string;
  puntos: string;
  instrumento: string;
  graphic: string;
}

export default function HelpMenu() {
  const [searchParams] = useSearchParams();
  const itemParam = searchParams.get("item");
  const categoryParam = searchParams.get("category");
  // Mantenemos selectedCategory para el acordeón, pero no lo usaremos para mostrar el detalle
  const [selectedCategory, setCategory] = useState<string | null>(null);
  // selectedItem ahora es clave para mostrar el detalle
  const [selectedItem, setItem] = useState<string | null>(null);

  // Efecto para manejar el parámetro 'item' en la URL
  // useEffect(() => {
  //   if (itemParam) {
  //     // Buscamos el ítem en todo el helpDataDimension para seleccionarlo
  //     for (const catKey in helpDataDimension) {
  //       if (
  //         Object.prototype.hasOwnProperty.call(helpDataDimension, catKey) &&
  //         helpDataDimension[catKey as keyof typeof helpDataDimension].items
  //       ) {
  //         const items = helpDataDimension[
  //           catKey as keyof typeof helpDataDimension
  //         ].items as Record<string, DimensionDetail>;
  //         if (itemParam in items) {
  //           setCategory(catKey); // Abrimos la categoría correspondiente al cargar desde URL
  //           setItem(itemParam);
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }, [itemParam]);
  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (itemParam) setItem(itemParam);
  }, [categoryParam, itemParam]);
  // Modificamos handleCategory para que NO anule selectedItem al cerrar un acordeón
  const handleCategory = (cat: string | null) => {
    setCategory((prev) => (prev === cat ? null : cat));
    // Eliminada la línea setItem(null);
  };

  // Al seleccionar un ítem, establecemos selectedItem. selectedCategory se establece en el Accordion onChange.
  const handleSelectItem = (item: string) => {
    setItem(item);
  };

  // Calculamos detail buscando selectedItem en TODO helpDataDimension
  // Esto permite que el detalle se muestre independientemente de si la categoría está abierta
  // const detail: DimensionDetail | null = useMemo(() => {
  //   if (!selectedItem) return null;

  //   for (const catKey in helpDataDimension) {
  //     if (
  //       Object.prototype.hasOwnProperty.call(helpDataDimension, catKey) &&
  //       helpDataDimension[catKey as keyof typeof helpDataDimension].items
  //     ) {
  //       const items = helpDataDimension[
  //         catKey as keyof typeof helpDataDimension
  //       ].items as Record<string, DimensionDetail>;
  //       if (selectedItem in items) {
  //         return items[selectedItem];
  //       }
  //     }
  //   }
  //   return null; // Si no se encuentra el ítem
  // }, [selectedItem]); // Recalcula solo cuando selectedItem cambia
  const detail = useMemo<DimensionDetail | null>(() => {
    if (!selectedCategory || !selectedItem) return null;
    const catData =
      helpDataDimension[selectedCategory as keyof typeof helpDataDimension];
    if (!catData) return null;
    return (
      (catData.items as Record<string, DimensionDetail>)[selectedItem] || null
    );
  }, [selectedCategory, selectedItem]);

  // La lista de ítems para la navegación sigue dependiendo de la categoría abierta
  // const itemsListForNavigation = selectedCategory
  //   ? Object.keys(
  //       (helpDataDimension[selectedCategory as keyof typeof helpDataDimension]
  //         ?.items as Record<string, DimensionDetail>) || {}
  //     )
  //   : [];

  return (
    <Box
      display="flex"
      sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Fixed left panel */}
      <Box
        width={300}
        height="100vh"
        sx={{
          position: "sticky",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        {Object.keys(helpDataDimension).map((catKey) => {
          return (
            <Accordion
              key={catKey}
              disableGutters
              square
              expanded={selectedCategory === catKey} // El acordeón sigue dependiendo de selectedCategory
              onChange={(e, expanded) =>
                handleCategory(expanded ? catKey : null)
              }
              sx={{ mb: 0 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ pr: 2 }}>
                <Typography>{catKey}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1 }}>
                <List disablePadding>
                  {/* Iterar sobre los ítems de la categoría actual para la lista de navegación */}
                  {Object.keys(
                    (helpDataDimension[catKey as keyof typeof helpDataDimension]
                      ?.items as Record<string, DimensionDetail>) || {}
                  ).map((it) => (
                    <ListItemButton
                      key={it}
                      selected={selectedItem === it} // selectedItem sigue marcando el ítem activo
                      onClick={() => handleSelectItem(it)} // Llamamos a la nueva función para seleccionar ítem
                      sx={{
                        py: 0.5,
                        pl: 2,
                        borderTop: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <ListItemText primary={it} />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Detail Panel */}
      <Box flex={1} p={3} overflow="auto">
        {!detail && (
          <Typography variant="h6" color="textSecondary">
            Selecciona una dimensión para ver la ayuda
          </Typography>
        )}
        {detail && (
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              {selectedItem} {detail.sigla ? `( ${detail.sigla} )` : ""}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {detail.definition && (
              <Typography>
                <strong>Definición:</strong> {detail.definition}
              </Typography>
            )}
            {detail.vestuario && (
              <Typography>
                <strong>Vestuario:</strong> {detail.vestuario}
              </Typography>
            )}
            {detail.posicion && (
              <Typography>
                <strong>Posición:</strong> {detail.posicion}
              </Typography>
            )}
            {detail.puntos && (
              <Typography>
                <strong>Puntos anatómicos:</strong> {detail.puntos}
              </Typography>
            )}
            {detail.instrumento && (
              <Typography>
                <strong>Instrumento:</strong> {detail.instrumento}
              </Typography>
            )}
            {Array.isArray(detail.graphic) &&
              detail.graphic.map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={`public/imagenes_dimensiones/${img}`}
                  alt={`${selectedItem} - imagen ${index + 1}`}
                  sx={{ mt: 2, maxWidth: "100%" }}
                />
              ))}
            {/* {detail.graphic && (
              <Box
                component="img"
                src={`public/imagenes_dimensiones/${detail.graphic[0]}`}
                alt={selectedItem!}
                sx={{ mt: 2, maxWidth: "100%" }}
              />
            )} */}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
