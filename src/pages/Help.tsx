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
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

// export default function HelpMenu() {
//   const [searchParams] = useSearchParams();
//   const itemParam = searchParams.get("item");
//   const categoryParam = searchParams.get("category");
//   // Mantenemos selectedCategory para el acordeón, pero no lo usaremos para mostrar el detalle
//   const [selectedCategory, setCategory] = useState<string | null>(null);
//   // selectedItem ahora es clave para mostrar el detalle
//   const [selectedItem, setItem] = useState<string | null>(null);

//   // Efecto para manejar el parámetro 'item' en la URL
//   // useEffect(() => {
//   //   if (itemParam) {
//   //     // Buscamos el ítem en todo el helpDataDimension para seleccionarlo
//   //     for (const catKey in helpDataDimension) {
//   //       if (
//   //         Object.prototype.hasOwnProperty.call(helpDataDimension, catKey) &&
//   //         helpDataDimension[catKey as keyof typeof helpDataDimension].items
//   //       ) {
//   //         const items = helpDataDimension[
//   //           catKey as keyof typeof helpDataDimension
//   //         ].items as Record<string, DimensionDetail>;
//   //         if (itemParam in items) {
//   //           setCategory(catKey); // Abrimos la categoría correspondiente al cargar desde URL
//   //           setItem(itemParam);
//   //           break;
//   //         }
//   //       }
//   //     }
//   //   }
//   // }, [itemParam]);
//   useEffect(() => {
//     if (categoryParam) setCategory(categoryParam);
//     if (itemParam) setItem(itemParam);
//   }, [categoryParam, itemParam]);
//   // Modificamos handleCategory para que NO anule selectedItem al cerrar un acordeón
//   const handleCategory = (cat: string | null) => {
//     setCategory((prev) => (prev === cat ? null : cat));
//     // Eliminada la línea setItem(null);
//   };

//   // Al seleccionar un ítem, establecemos selectedItem. selectedCategory se establece en el Accordion onChange.
//   const handleSelectItem = (item: string) => {
//     setItem(item);
//   };

//   // Calculamos detail buscando selectedItem en TODO helpDataDimension
//   // Esto permite que el detalle se muestre independientemente de si la categoría está abierta
//   // const detail: DimensionDetail | null = useMemo(() => {
//   //   if (!selectedItem) return null;

//   //   for (const catKey in helpDataDimension) {
//   //     if (
//   //       Object.prototype.hasOwnProperty.call(helpDataDimension, catKey) &&
//   //       helpDataDimension[catKey as keyof typeof helpDataDimension].items
//   //     ) {
//   //       const items = helpDataDimension[
//   //         catKey as keyof typeof helpDataDimension
//   //       ].items as Record<string, DimensionDetail>;
//   //       if (selectedItem in items) {
//   //         return items[selectedItem];
//   //       }
//   //     }
//   //   }
//   //   return null; // Si no se encuentra el ítem
//   // }, [selectedItem]); // Recalcula solo cuando selectedItem cambia
//   const detail = useMemo<DimensionDetail | null>(() => {
//     if (!selectedCategory || !selectedItem) return null;
//     const catData =
//       helpDataDimension[selectedCategory as keyof typeof helpDataDimension];
//     if (!catData) return null;
//     return (
//       (catData.items as Record<string, DimensionDetail>)[selectedItem] || null
//     );
//   }, [selectedCategory, selectedItem]);

//   // La lista de ítems para la navegación sigue dependiendo de la categoría abierta
//   // const itemsListForNavigation = selectedCategory
//   //   ? Object.keys(
//   //       (helpDataDimension[selectedCategory as keyof typeof helpDataDimension]
//   //         ?.items as Record<string, DimensionDetail>) || {}
//   //     )
//   //   : [];

//   return (
//     <Box
//       display="flex"
//       sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
//     >
//       {/* Fixed left panel */}
//       <Box
//         width={300}
//         height="100vh"
//         sx={{
//           position: "sticky",
//           borderRight: "1px solid #ddd",
//           overflowY: "auto",
//         }}
//       >
//         {Object.keys(helpDataDimension).map((catKey) => {
//           return (
//             <Accordion
//               key={catKey}
//               disableGutters
//               square
//               expanded={selectedCategory === catKey} // El acordeón sigue dependiendo de selectedCategory
//               onChange={(e, expanded) =>
//                 handleCategory(expanded ? catKey : null)
//               }
//               sx={{ mb: 0 }}
//             >
//               <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ pr: 2 }}>
//                 <Typography>{catKey}</Typography>
//               </AccordionSummary>
//               <AccordionDetails sx={{ p: 1 }}>
//                 <List disablePadding>
//                   {/* Iterar sobre los ítems de la categoría actual para la lista de navegación */}
//                   {Object.keys(
//                     (helpDataDimension[catKey as keyof typeof helpDataDimension]
//                       ?.items as Record<string, DimensionDetail>) || {}
//                   ).map((it) => (
//                     <ListItemButton
//                       key={it}
//                       selected={selectedItem === it} // selectedItem sigue marcando el ítem activo
//                       onClick={() => handleSelectItem(it)} // Llamamos a la nueva función para seleccionar ítem
//                       sx={{
//                         py: 0.5,
//                         pl: 2,
//                         borderTop: "1px solid rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <ListItemText primary={it} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               </AccordionDetails>
//             </Accordion>
//           );
//         })}
//       </Box>

//       {/* Detail Panel */}
//       <Box flex={1} p={3} overflow="auto">
//         {!detail && (
//           <Typography variant="h6" color="textSecondary">
//             Selecciona una dimensión para ver la ayuda
//           </Typography>
//         )}
//         {detail && (
//           <Paper elevation={2} sx={{ p: 2 }}>
//             <Typography variant="h5" gutterBottom>
//               {selectedItem} {detail.sigla ? `( ${detail.sigla} )` : ""}
//             </Typography>
//             <Divider sx={{ my: 1 }} />
//             <Box sx={{ display: "flex" }}>
//               <Box>
//                 {detail.definition && (
//                   <Typography>
//                     <strong>Definición:</strong> {detail.definition}
//                   </Typography>
//                 )}
//                 {detail.vestuario && (
//                   <Typography>
//                     <strong>Vestuario:</strong> {detail.vestuario}
//                   </Typography>
//                 )}
//                 {detail.posicion && (
//                   <Typography>
//                     <strong>Posición:</strong> {detail.posicion}
//                   </Typography>
//                 )}
//                 {detail.puntos && (
//                   <Typography>
//                     <strong>Puntos anatómicos:</strong> {detail.puntos}
//                   </Typography>
//                 )}
//                 {detail.instrumento && (
//                   <Typography>
//                     <strong>Instrumento:</strong> {detail.instrumento}
//                   </Typography>
//                 )}
//               </Box>
//               <Box >
//                 {Array.isArray(detail.graphic) &&
//                   detail.graphic.map((img, index) => (
//                     <Box
//                       key={index}
//                       component="img"
//                       src={`/imagenes_dimensiones/${img}`}
//                       alt={`${selectedItem} - imagen ${index + 1}`}
//                       sx={{ mt: 2, maxWidth: "100%" }}
//                     />
//                   ))}
//               </Box>

//               {/* {detail.graphic && (
//               <Box
//                 component="img"
//                 src={`public/imagenes_dimensiones/${detail.graphic[0]}`}
//                 alt={selectedItem!}
//                 sx={{ mt: 2, maxWidth: "100%" }}
//                 />
//                 )} */}
//             </Box>
//           </Paper>
//         )}
//       </Box>
//     </Box>
//   );
// }

export default function HelpMenu() {
  const [searchParams] = useSearchParams();
  const itemParam = searchParams.get("item");
  const categoryParam = searchParams.get("category");
  
  const [selectedCategory, setCategory] = useState<string | null>(categoryParam);
  const [selectedItem, setItem] = useState<string | null>(itemParam);

  const handleCategoryChange = (cat: string | null) => {
    setCategory(prev => prev === cat ? null : cat);
  };

  const handleSelectItem = (item: string) => {
    setItem(item);
  };

  const detail = useMemo<DimensionDetail | null>(() => {
    if (!selectedCategory || !selectedItem) return null;
    const catData = helpDataDimension[selectedCategory as keyof typeof helpDataDimension];
    return catData?.items?.[selectedItem] || null;
  }, [selectedCategory, selectedItem]);

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Panel izquierdo - Menú de navegación */}
      <Box sx={{
        width: 300,
        height: '100%',
        borderRight: '1px solid #eee',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 1,
        zIndex: 1
      }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dimensiones Antropométricas
          </Typography>
        </Box>
        
        {Object.keys(helpDataDimension).map((catKey) => (
          <Accordion 
            key={catKey}
            disableGutters
            expanded={selectedCategory === catKey}
            onChange={(_, expanded) => handleCategoryChange(expanded ? catKey : null)}
            sx={{ 
              '&:before': { display: 'none' },
              boxShadow: 'none',
              borderBottom: '1px solid #f5f5f5'
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: selectedCategory === catKey ? 'action.selected' : 'inherit',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>{catKey}</Typography>
            </AccordionSummary>
            
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {Object.keys(helpDataDimension[catKey as keyof typeof helpDataDimension]?.items || {}).map((it) => (
                  <ListItemButton
                    key={it}
                    selected={selectedItem === it}
                    onClick={() => handleSelectItem(it)}
                    sx={{
                      pl: 3,
                      py: 1,
                      borderTop: '1px solid rgba(0,0,0,0.05)',
                      '&.Mui-selected': {
                        backgroundcolor: 'primary.light',
                        '&:hover': { backgroundcolor: 'primary.light' }
                      }
                    }}
                  >
                    <ListItemText 
                      primary={it} 
                      primaryTypographyProps={{ variant: 'body2' }} 
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Panel derecho - Detalle de la dimensión */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}>
        {!detail ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}>
            <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Selecciona una dimensión para ver la ayuda
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}>
            {/* Información textual */}
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              p: 4,
              maxWidth: '60%'
            }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedItem} {detail.sigla && `(${detail.sigla})`}
                  </Typography>
                  <Divider />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {detail.definition && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Definición
                      </Typography>
                      <Typography variant="body1">{detail.definition}</Typography>
                    </Box>
                  )}
                  
                  {detail.vestuario && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Vestuario
                      </Typography>
                      <Typography variant="body1">{detail.vestuario}</Typography>
                    </Box>
                  )}
                  
                  {detail.posicion && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Posición
                      </Typography>
                      <Typography variant="body1">{detail.posicion}</Typography>
                    </Box>
                  )}
                  
                  {detail.puntos && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Puntos Anatómicos
                      </Typography>
                      <Typography variant="body1">{detail.puntos}</Typography>
                    </Box>
                  )}
                  
                  {detail.instrumento && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Instrumento
                      </Typography>
                      <Typography variant="body1">{detail.instrumento}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
            
            {/* Galería de imágenes */}
            <Box sx={{
              width: 400,
              height: '100%',
              overflowY: 'auto',
              bgcolor: 'grey.100',
              borderLeft: '1px solid #eee',
              p: 3
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Referencia Visual
              </Typography>
              
              {Array.isArray(detail.graphic) && detail.graphic.length > 0 ? (
                detail.graphic.map((img, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box 
                      component="img"
                      src={`/imagenes_dimensiones/${img}`}
                      alt={`${selectedItem} - Imagen ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        // maxHeight: 300,
                        objectFit: 'contain',
                        borderRadius: 1,
                        boxShadow: 2
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                      Figura {index + 1}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'calc(100% - 40px)',
                  color: 'text.secondary'
                }}>
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