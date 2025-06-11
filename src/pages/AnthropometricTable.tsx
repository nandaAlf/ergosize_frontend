// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TableSortLabel,
//   Toolbar,
//   Typography,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
//   Button,
//   Paper,
//   Avatar,
//   Stack,
//   Chip,
// } from "@mui/material";
// import { visuallyHidden } from "@mui/utils";
// import Search from "../components/filtros/Search";
// import { color } from "three/tsl";
// import BarChartIcon from "@mui/icons-material/BarChart";
// interface PercentileMap {
//   [key: string]: number;
// }
// interface ResultRow {
//   dimension: string;
//   stats?: { mean: number; sd: number; percentiles: PercentileMap };
//   by_gender?: {
//     M?: { mean: number; sd: number; percentiles: PercentileMap };
//     F?: { mean: number; sd: number; percentiles: PercentileMap };
//   };
// }
// interface AnthropometricTableProps {
//   studyId: number;
//   gender?: "M" | "F" | "mixto";
//   ageMin?: string;
//   ageMax?: string;
//   dimensions: number[];
//   percentilesList: number[];
// }
// type Order = "asc" | "desc";
// interface ColumnDef {
//   id: string;
//   label: string;
//   getValue: (row: ResultRow) => number | string;
// }

// const AnthropometricTable: React.FC<AnthropometricTableProps> = ({
//   studyId,
//   gender,
//   ageMin,
//   ageMax,
//   dimensions,
//   percentilesList,
// }) => {
//   const [data, setData] = useState<ResultRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [orderBy, setOrderBy] = useState<string>("dimension");
//   const [order, setOrder] = useState<Order>("asc");
//   const [searchTerm, setSearchTerm] = useState("");
//   const isMixed = gender === "mixto";

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
//       if (gender) params.set("gender", gender);
//       if (ageMin) params.set("age_min", ageMin);
//       if (ageMax) params.set("age_max", ageMax);
//       if (dimensions.length) params.set("dimensions", dimensions.join(","));
//       if (percentilesList.length)
//         params.set("percentiles", percentilesList.join(","));
//       try {
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/test-percentiles/${studyId}/?${params.toString()}`
//         );
//         setData(res.data.results || []);
//       } catch {
//         setError("Error al cargar datos");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [studyId, gender, ageMin, ageMax, dimensions, percentilesList]);

//   const columns: ColumnDef[] = useMemo(() => {
//     const cols: ColumnDef[] = [
//       { id: "dimension", label: "Dimensión", getValue: (r) => r.dimension },
//     ];
//     if (isMixed) {
//       ["M", "F"].forEach((g) => {
//         cols.push({
//           id: `mean_${g}`,
//           label: `Media ${g}`,
//           getValue: (r) => r.by_gender?.[g]?.mean ?? NaN,
//         });
//         cols.push({
//           id: `sd_${g}`,
//           label: `SD ${g}`,
//           getValue: (r) => r.by_gender?.[g]?.sd ?? NaN,
//         });
//         percentilesList.forEach((p) =>
//           cols.push({
//             id: `p${p}_${g}`,
//             label: `${p}% ${g}`,
//             getValue: (r) => r.by_gender?.[g]?.percentiles[p.toString()] ?? NaN,
//           })
//         );
//       });
//     } else {
//       cols.push({
//         id: "mean",
//         label: "Media",
//         getValue: (r) => r.stats?.mean ?? NaN,
//       });
//       cols.push({ id: "sd", label: "SD", getValue: (r) => r.stats?.sd ?? NaN });
//       percentilesList.forEach((p) =>
//         cols.push({
//           id: `p${p}`,
//           label: `${p}%`,
//           getValue: (r) => r.stats?.percentiles[p.toString()] ?? NaN,
//         })
//       );
//     }
//     return cols;
//   }, [isMixed, percentilesList]);

//   const sorted = useMemo(
//     () =>
//       [...data].sort((a, b) => {
//         const col = columns.find((c) => c.id === orderBy)!;
//         const aV = col.getValue(a),
//           bV = col.getValue(b);
//         if (aV < bV) return order === "asc" ? -1 : 1;
//         if (aV > bV) return order === "asc" ? 1 : -1;
//         return 0;
//       }),
//     [data, orderBy, order, columns]
//   );
//   const filtered = useMemo(
//     () =>
//       sorted.filter((r) =>
//         r.dimension.toLowerCase().includes(searchTerm.toLowerCase())
//       ),
//     [sorted, searchTerm]
//   );
//   const paged = useMemo(
//     () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//     [filtered, page, rowsPerPage]
//   );

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!data.length) return <Typography>No hay datos</Typography>;

//   return (
//     <Box>
//       <Paper
//         elevation={0}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           p: 2,
//           mb: 3,
//           // mheight: "100%",
//           // overflow:"hidden"
//           // borderRadius: 2,
//           // backgroundColor: '#F9FAFB',
//           // border: "1px solid #E5E7EB",
//         }}
//       >
//         <Avatar
//           sx={{
//             bgcolor: "primary.main",
//             width: 48,
//             height: 48,
//             mr: 2,
//           }}
//         >
//           <BarChartIcon fontSize="large" />
//         </Avatar>

//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="h5" component="div" gutterBottom>
//             Peso, estatura y complexión
//           </Typography>

//           <Stack direction="row" spacing={3} alignItems="center">
//             <Typography variant="body2">
//               <Box
//                 component="span"
//                 sx={{
//                   color: "text.primary",
//                   fontWeight: 500 /* opcional para negrita */,
//                 }}
//               >
//                 Ubicación:
//               </Box>{" "}
//               <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
//                 Cuba / Cienfuegos / UCLV
//               </Box>
//             </Typography>
//             <Typography variant="body2">
//               <Box
//                 component="span"
//                 sx={{
//                   color: "text.primary",
//                   fontWeight: 500 /* opcional para negrita */,
//                 }}
//               >
//                 Participantes:
//               </Box>{" "}
//               <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
//                 300
//               </Box>
//             </Typography>
//             <Typography variant="body2">
//               <Box
//                 component="span"
//                 sx={{
//                   color: "text.primary",
//                   fontWeight: 500 /* opcional para negrita */,
//                 }}
//               >
//                 Genero:
//               </Box>{" "}
//               <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
//                 Mixto
//               </Box>
//             </Typography>
//             {/* <Chip label={`Ubicación: Cuba /Cienfuegos / UCLV`} size="small" />
//             <Chip label={`Género: Femenino`} size="small" />
//             <Chip label={`300 participantes`} size="small" /> */}
//           </Stack>
//         </Box>
//       </Paper>

//       <Box
//         sx={{
//           boxSizing: "border-box",
//           // p: 2, // 24px
//           m: "40px 20px",
//           borderRadius: "8px",
//           // backgroundColor: "#fff", // fondo claro
//           // border: "1px solid #E5E7EB", // borde gris claro
//           // boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//         }}
//       >
//         <Toolbar
//           sx={{
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             boxSizing: "border-box",
//           }}
//         >
//           <Box sx={{ width: "500px" }}>
//             <Search
//               text="Buscar dimensión"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </Box>

//           <Button sx={{ width: "150px" }} variant="contained">
//             Exportar
//           </Button>
//           {/* <FormControlLabel
//             control={
//               <Switch
//                 checked={false}
//                 onChange={() => setOrderBy("dimension")}
//               />
//             }
//             label="Vista compacta"
//           /> */}
//         </Toolbar>

//         <TableContainer
//           sx={{
//             borderRadius: "8px",
//             // overflow: "hidden", // para que el borde redondeado funcione
//             // border: "1px solid #E5E7EB", // mismo borde en la tabla
//             // backgroundColor: "white",
//             border: "1px solid #E5E7EB",
//             maxHeight: 440,
//             // overflow: "auto",
//           }}
//         >
//           <Table
//             size={false ? "small" : "medium"}
//             sx={{
//               borderCollapse: "collapse",
//               minWidth: 650,
//             }}
//             stickyHeader
//             aria-label="anthropometric table"
//           >
//             <TableHead>
//               {isMixed ? (
//                 <TableRow>
//                    <TableCell align="center" colSpan={1} sx={{border:"0px solid transparent"}}>

//                   </TableCell>
//                   <TableCell align="center" colSpan={2+percentilesList.length} sx={{border:"1px solid #E5E7EB"}}>
//                     Hombres
//                   </TableCell>
//                   <TableCell align="center" colSpan={2+percentilesList.length} sx={{border:"1px solid #E5E7EB"}}>
//                     Mujeres
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 <>
//                  <TableRow>
//                    <TableCell align="center" colSpan={1} sx={{border:"0px solid transparent"}}>

//                   </TableCell>
//                   <TableCell align="center" colSpan={2+percentilesList.length} sx={{border:"1px solid #E5E7EB"}}>
//                      {gender === "F" ? "Mujeres" : gender === "M" ? "Hombres" : "Hombres y mujeres"}
//                   </TableCell>

//                 </TableRow>
//                 </>
//               )}
//               <TableRow>
//                 {columns.map((col) => {
//                   const isFirstF = col.id.startsWith("mean_F");
//                   console.log("id", col.id);
//                   return (
//                     <TableCell
//                       key={col.id}
//                       align={col.id === "dimension" ? "left" : "right"}
//                       sortDirection={orderBy === col.id ? order : false}
//                       sx={{
//                         border: "1px solid #E5E7EB", // borde estándar de cada celda
//                         ...(isFirstF && {
//                           // borde izquierdo más grueso y de color resaltado
//                           borderLeft: "4px solid #E5E7EB",
//                           pl: 1,
//                         }),
//                       }}
//                     >
//                       <TableSortLabel
//                         active={orderBy === col.id}
//                         direction={order}
//                         onClick={() => {
//                           const asc = orderBy === col.id && order === "asc";
//                           setOrder(asc ? "desc" : "asc");
//                           setOrderBy(col.id);
//                         }}
//                       >
//                         {col.label}
//                         {orderBy === col.id && (
//                           <Box component="span" sx={visuallyHidden}>
//                             {order === "desc"
//                               ? "sorted descending"
//                               : "sorted ascending"}
//                           </Box>
//                         )}
//                       </TableSortLabel>
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paged.map((row, i) => (
//                 <TableRow key={i} hover>
//                   {columns.map((col) => {
//                     const isFirstF = col.id.startsWith("mean_F");
//                     return (
//                       <TableCell
//                         key={col.id}
//                         align={col.id === "dimension" ? "left" : "right"}
//                         sx={{
//                           border: "1px solid #E5E7EB", // borde estándar de cada celda
//                           ...(isFirstF && {
//                             // borde izquierdo más grueso y de color resaltado
//                             borderLeft: "4px solid #E5E7EB",
//                             pl: 1,
//                           }),
//                         }}
//                       >
//                         {typeof col.getValue(row) === "number"
//                           ? (col.getValue(row) as number).toFixed(2)
//                           : col.getValue(row)}
//                       </TableCell>
//                     );
//                   })}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Box display="flex" justifyContent="flex-end" mt={2}>
//           <TablePagination
//             component="div"
//             count={filtered.length}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             onPageChange={(_, p) => setPage(p)}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//             rowsPerPageOptions={[5, 10, 25]}
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// };
// export default AnthropometricTable;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  CircularProgress,
  Typography,
  Button,
  MenuItem,
  Menu,
  Container,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Search from "../components/filtros/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import { getFile } from "../service/service";
import { CalendarMonth, CalendarMonthOutlined } from "@mui/icons-material";

interface Stats {
  mean: number;
  sd: number;
  percentiles: Record<string, number>;
}
interface ApiEntry {
  dimension: string;
  dimension_id: number;
  by_gender: {
    [genderKey: string]: {
      [ageRange: string]: Stats;
    };
  };
}
type Order = "asc" | "desc";

interface Props {
  studyId: number;
  gender?: "M" | "F" | "mixto" | "";
  dimensions: number[];
  percentilesList: number[];
  age_ranges: string;
  tableTitle: string;
  location: string;
  size: number;
  description: string;
  start_date: string;
  end_date: string;
}

const AnthropometricTable: React.FC<Props> = ({
  studyId,
  gender,
  dimensions,
  percentilesList,
  age_ranges,
  tableTitle,
  location,
  size,
  description,
  start_date,
  end_date,
}) => {
  const [data, setData] = useState<ApiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string>("dimension");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Estado para el menú de exportación
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(anchorEl);
  const handleExportClick = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleExportClose = () => {
    setAnchorEl(null);
  };
  // Cuando elija Excel o PDF
  const handleExport = async (format: "excel" | "pdf") => {
    // construimos params igual que en la petición de datos
    alert("hola");
    const params = new URLSearchParams({
      age_ranges,
      gender: gender || "",
      dimensions: dimensions.join(","),
      percentiles: percentilesList.join(","),
    });

    await getFile(format, studyId.toString(), params);
    handleExportClose();
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/test-percentiles/${studyId}`, {
        params: {
          age_ranges,
          gender,
          dimensions: dimensions.join(","),
          percentiles: percentilesList.join(","),
        },
      })
      .then((res) => setData(res.data.results || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [studyId, gender, dimensions, percentilesList, age_ranges]);

  // Géneros y rangos detectados
  const genders = useMemo(
    () => (data[0] ? Object.keys(data[0].by_gender) : []),
    [data]
  );
  const ageRanges = useMemo(
    () =>
      data[0] && genders.length
        ? Object.keys(data[0].by_gender[genders[0]])
        : [],
    [data, genders]
  );

  // Estadísticas fijas
  const statsCols = useMemo(
    () => ["mean", "sd", ...percentilesList.map((p) => `p${p}`)],
    [percentilesList]
  );

  // Función para obtener valor de ordenación
  const getSortValue = (row: ApiEntry) => {
    if (orderBy === "dimension") {
      return row.dimension.toLowerCase();
    }
    // buscamos en el primer género y primer rango
    const g = genders[0];
    const r = ageRanges[0];
    const stats = row.by_gender[g]?.[r];
    if (!stats) return -Infinity;
    if (orderBy === "mean") return stats.mean;
    if (orderBy === "sd") return stats.sd;
    // percentil
    const pKey = orderBy.replace("p", "");
    return stats.percentiles[pKey] ?? -Infinity;
  };

  // Ordenamos
  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aV = getSortValue(a);
      const bV = getSortValue(b);
      if (aV < bV) return order === "asc" ? -1 : 1;
      if (aV > bV) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const filtered = useMemo(
    () =>
      sorted.filter((r) =>
        r.dimension.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sorted, searchTerm]
  );

  // const paged = useMemo(
  //   () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [sorted, page, rowsPerPage]
  // );
  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const handleSort = (field: string) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrder("asc");
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data.length) return <Typography>No hay datos</Typography>;

  return (
    <Box sx={{ padding: "5px", margin: "25px 20px" }}>
      {/* <Paper> */}
      {/* <Typography
        sx={{ flex: "1 1 100%",
          //  ml: 3 
          }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {tableTitle}
      </Typography>
      <Typography
        sx={{ flex: "1 1 100%",
          //  ml: 3 
          }}
        // variant=""
        // id="tableTitle"
        component="div"
      >
        Lugar: {location} Muestra :{size}
      </Typography> */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 0 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {tableTitle}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <PlaceIcon fontSize="small" />
            <Box component="span" sx={{ fontWeight: 500 }}>
              Lugar:
            </Box>
            {location}
          </Typography>

          <Typography
            variant="body1"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <GroupsIcon fontSize="small" />
            <Box component="span" sx={{ fontWeight: 500 }}>
              Muestra:
            </Box>
            {size}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <CalendarMonth fontSize="small" />
            <Box component="span" sx={{ fontWeight: 500 }}>
              Inicio
            </Box>
            {start_date} /
            <Box component="span" sx={{ fontWeight: 500 }}>
              Fin
            </Box>
            {end_date || "-"}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          component="div"
          sx={{  
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <GroupsIcon fontSize="small" />
          <Box component="span" sx={{ fontWeight: 500 }}></Box>
          {description}
        </Typography>
      </Box>
      {/* </Paper> */}
      <Box
        display="flex"
        flexWrap="wrap"
        // justifyContent="space-between"
        gap={2}
        mt={4}
        mb={2}
        //           sx={{
        //             p: 2,
        //             display: "flex",
        //             justifyContent: "space-between",
        //             flexWrap: "wrap",
        //             boxSizing: "border-box",
        //           }}
      >
        <Box sx={{ width: "500px" }}>
          <Search
            text="Buscar dimensión"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        {/* 
        <Button sx={{ width: "150px" }} variant="contained">
          Exportar
        </Button> */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={handleExportClick}>
            Exportar…
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openExportMenu}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleExport("excel")}>
              Exportar a Excel
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>
              Exportar a PDF
            </MenuItem>
          </Menu>
        </Box>

        {/* <FormControlLabel
//             control={
  //               <Switch
//                 checked={false}
//                 onChange={() => setOrderBy("dimension")}
//               />
//             }
//             label="Vista compacta"
//           /> */}
      </Box>
      <Paper>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              {/* Nivel 1: Género */}
              <TableRow>
                <TableCell
                  rowSpan={3}
                  align="left"
                  sx={{ border: "1px solid #E5E7EB" }}
                >
                  <TableSortLabel
                    active={orderBy === "dimension"}
                    direction={order}
                    onClick={() => handleSort("dimension")}
                  >
                    Dimensión
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  </TableSortLabel>
                </TableCell>

                {genders.map((g) => (
                  <TableCell
                    key={g}
                    align="center"
                    colSpan={ageRanges.length * statsCols.length}
                    sx={{ border: "1px solid #E5E7EB" }}
                  >
                    {g === "M" ? "Hombres" : g === "F" ? "Mujeres" : "Mixto"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Nivel 2: Rango de edad */}
              <TableRow>
                <TableCell sx={{ display: "none" }} /> {/* placeholder */}
                {genders.map((g) =>
                  ageRanges.map((r) => (
                    <TableCell
                      key={`${g}-${r}`}
                      align="center"
                      colSpan={statsCols.length}
                      sx={{ border: "1px solid #E5E7EB" }}
                    >
                      {r}
                    </TableCell>
                  ))
                )}
              </TableRow>

              {/* Nivel 3: Estadísticas */}
              <TableRow>
                <TableCell sx={{ display: "none" }} /> {/* placeholder */}
                {genders.map((g) =>
                  ageRanges.map((r) =>
                    statsCols.map((stat) => (
                      <TableCell
                        key={`${g}-${r}-${stat}`}
                        align="right"
                        sx={{ border: "1px solid #E5E7EB", py: 1 }}
                      >
                        <TableSortLabel
                          active={orderBy === stat}
                          direction={order}
                          onClick={() => handleSort(stat)}
                          hideSortIcon={false}
                        >
                          {stat === "mean"
                            ? "Media"
                            : stat === "sd"
                              ? "SD"
                              : stat.replace("p", "") + "%"}
                        </TableSortLabel>
                      </TableCell>
                    ))
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {paged.map((row) => (
                <TableRow key={row.dimension} hover>
                  {/* Dimensión a la izquierda */}
                  <TableCell
                    sx={{ border: "1px solid #E5E7EB", py: 1 }}
                    align="left"
                  >
                    {row.dimension}
                  </TableCell>

                  {genders.map((g) =>
                    ageRanges.map((r) =>
                      statsCols.map((stat) => {
                        const statsBlock = row.by_gender[g]?.[r];
                        const value =
                          stat === "mean"
                            ? statsBlock?.mean
                            : stat === "sd"
                              ? statsBlock?.sd
                              : statsBlock?.percentiles[stat.replace("p", "")];
                        return (
                          <TableCell
                            key={`${row.dimension}-${g}-${r}-${stat}`}
                            align="right"
                            sx={{ border: "1px solid #E5E7EB", py: 1 }}
                          >
                            {value != null ? value.toFixed(2) : "-"}
                          </TableCell>
                        );
                      })
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" mt={1}>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AnthropometricTable;
