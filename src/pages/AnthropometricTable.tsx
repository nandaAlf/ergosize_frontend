import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { CalendarMonth } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  CircularProgress,

  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Search from "../components/filtros/Search";
import { getFile } from "../service/service";
// import HeaderCard from "../components/card/tableheaderCard"

// import {
//   GenderComparisonChart,
// } from "../components/charts/barChart";
import { HeaderCard } from "../components/card/tableheaderCard";
import { GenderComparisonChart } from "../components/charts/BarChart";
import PercentilesLineChart from "../components/charts/LineChart";
import { getPopulationLabel } from "../utils/getPopulationLabel";

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
interface DataEntry {
  // dimension: string;
  // dimension_id: string | number;
  // by_gender: {
  //   [genderKey: string]: {
  //     [ageRange: string]: Stats;
  //   };
  // };
  dimension: string;
  dimension_id: string | number;
  by_gender: {
    [genderKey: string]: {
      [ageRange: string]: {
        mean: number | null;
        sd: number | null;
        percentiles: Record<string, number | null>;
      };
    };
  };
}

type Order = "asc" | "desc";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel({ children, value, index, ...props }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
// interface Props {
//   studyId: number;
//   gender?: "M" | "F" | "mixto" | "";
//   dimensions: number[];
//   percentilesList: number[];
//   age_ranges: string;
//   tableTitle: string;
//   location: string;
//   size: number;
//   description: string;
//   start_date: string;
//   end_date: string;
//   classification: string;
// }
interface Props {
  studyId?: number; // Hacerlo opcional para usar con datos locales
  gender?: "M" | "F" | "mixto" | "";
  dimensions?: number[];
  percentilesList: number[];
  age_ranges: string;
  tableTitle: string;
  location: string;
  size: number;
  description: string;
  start_date: string;
  end_date: string;
  classification: string;
  // Props para datos locales
  localData?: DataEntry[]; // Datos cargados localmente
  // loading?: boolean; // Estado de carga opcional
  // error?: string | null; // Error opcional
  data: DataEntry[];
  loading: boolean;
  error: string | null;
}

interface Series {
  id: string;
  data: { x: string; y: number }[];
}

const AnthropometricTable: React.FC<Props> = ({
  // studyId,
  // gender,
  // dimensions,
  // percentilesList,
  // age_ranges,
  // tableTitle,
  // location,
  // size,
  // description,
  // start_date,
  // end_date,
  // classification,
  studyId,
  gender,
  dimensions = [],
  percentilesList,
  age_ranges,
  tableTitle,
  location,
  size,
  description,
  start_date,
  end_date,
  classification,
  localData,
  // loading: propLoading,
  // error: propError,
}) => {
  // Estados internos (solo se usan si no se proveen datos locales)
  const [internalData, setInternalData] = useState<DataEntry[]>([]);
  // const [internalLoading, setInternalLoading] = useState(true);
  // const [internalError, setInternalError] = useState<string | null>(null);

  // Usamos datos de props si están disponibles, de lo contrario usamos el estado interno
  // const data = localData || internalData;
  const data = localData || internalData;
  // const loading = propLoading !== undefined ? propLoading : internalLoading;
  // const error = propError !== undefined ? propError : internalError;
  // const [data, setData] = useState<ApiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string>("dimension");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Estado para el menú de exportación
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(anchorEl);
  const handleExportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleExportClose = () => {
    setAnchorEl(null);
  };
  // Dentro de AnthropometricTable.tsx
  const [selectedPercentile, setSelectedPercentile] = useState<number>(50); // Valor inicial
  // Cuando elija Excel o PDF
  const handleExport = async (format: "excel" | "pdf") => {
    // construimos params igual que en la petición de datos
    const params = new URLSearchParams({
      age_ranges,
      gender: gender || "",
      dimensions: dimensions.join(","),
      percentiles: percentilesList.join(","),
    });

    if (studyId !== undefined) {
      await getFile(format, studyId.toString(), params);
    } else {
      // Opcional: mostrar un mensaje de error o manejar el caso
      console.error("studyId is undefined, cannot export file.");
    }
    handleExportClose();
  };

  useEffect(() => {
    console.log("data", data);
  }, [data]);
  useEffect(() => {
    if (localData) {
      setLoading(false);
      return;
    }

    axios
      // .get(`http://127.0.0.1:8000/api/test-percentiles/${studyId}`, {
      .get(`https://ergosize-app.onrender.com/api/test-percentiles/${studyId}`, {
        params: {
          age_ranges,
          gender,
          dimensions: dimensions.join(","),
          percentiles: percentilesList.join(","),
        },
      })
      .then((res) => {
        setInternalData(res.data.results || []);
        // setInternalError(null);
      })
      // .catch(() => setInternalError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [studyId, gender, dimensions, percentilesList, age_ranges, localData]);
  // Géneros y rangos detectados
  const genders = useMemo(
    () => (data[0] ? Object.keys(data[0].by_gender) : []),
    [data]
  );
  // const ageRanges = useMemo(
  //   () =>
  //     data[0] && genders.length
  //       ? Object.keys(data[0].by_gender[genders[0]])
  //       : [],
  //   [data, genders]
  // );
  const ageRanges = useMemo(() => {
    if (!data.length || !genders.length) return [];

    const allRanges = new Set();

    genders.forEach((gender) => {
      const genderData = data[0].by_gender[gender];
      if (genderData) {
        Object.keys(genderData).forEach((range) => allRanges.add(range));
      }
    });

    return Array.from(allRanges).sort();
  }, [data, genders]);

  // Estadísticas fijas
  const statsCols = useMemo(
    () => ["mean", "sd", ...percentilesList.map((p) => `p${p}`)],
    [percentilesList]
  );

  // Función para obtener valor de ordenación
  const getSortValue = (row: DataEntry) => {
      if (orderBy === "dimension") {
        return row.dimension.toLowerCase();
      }
      // buscamos en el primer género y primer rango
      const g: string = genders[0] as string;
      const r: string = ageRanges[0] as string;
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
      if(aV && bV){

        if (aV < bV) return order === "asc" ? -1 : 1;
        if (aV > bV) return order === "asc" ? 1 : -1;
      }
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
  // Estados para controlar el gráfico
  const [chartDim, setChartDim] = useState<string>("");
  const [chartGender, setChartGender] = useState<string>("");

  // Mejorado: Datos para el gráfico

  // Construir `series` al estilo de tu demo
  const chartSeries: Series[] = useMemo(() => {
    const row = data.find((r) => r.dimension === chartDim);
    if (!row) return [];
    // Un objeto Series por percentil
    return percentilesList.map((p: number | string) => ({
      id: `p${p}`,
      data: ageRanges.map((age) => ({
        x: String(age),
        y: Number(
          row.by_gender[String(chartGender) as string]?.[String(age) as string]?.percentiles[p.toString()] ?? NaN
        ),
      })),
    }));
  }, [data, chartDim, chartGender, percentilesList, ageRanges]);

  const handleSort = (field: string) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrder("asc");
    }
  };

  // Dentro de AnthropometricTable.tsx
  const comparisonData = useMemo(() => {
    return (ageRanges as string[]).map((age) => {
      const row = data.find((d) => d.dimension === chartDim);
      const maleValue =
        row?.by_gender["M"]?.[age]?.percentiles[selectedPercentile] ?? null;
      const femaleValue =
        row?.by_gender["F"]?.[age]?.percentiles[selectedPercentile] ?? null;

      return {
        ageRange: age,
        maleValue,
        femaleValue,
      };
    });
  }, [chartDim, selectedPercentile, ageRanges, data]); // Añade data como dependencia
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };
  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  // if (error) return <Typography color="error">{error}</Typography>;
  if (!data.length) return <Typography>No hay datos</Typography>;

  return (
    // <Box sx={{ padding: "5px", margin: "25px 20px" }}>
    <Box
      sx={{
        padding: 3,
        margin: "10px 25px",
        // backgroundColor: "#f8f9fa",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        height: "100vh",
      }}
    >
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Tabla antropométrica" />
        <Tab label="Evolución de los percentiles" />
        <Tab label="Comparación de géneros" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        {/* Study Header Card */}
        <HeaderCard
          title={tableTitle}
          description={description}
          buttons={[
            {
              label: "Exportar",
              onClick: () => handleExportClick({} as React.MouseEvent<HTMLButtonElement>),
              icon: <FileDownloadIcon />,
              variant: "contained",
            },
          ]}
          metadata={[
            { icon: <PlaceIcon />, label: `Lugar: ${location}` },
            { icon: <GroupsIcon />, label: `Muestra: ${size}` },
            {
              icon: <CalendarMonth />,
              label: `Tipo de población: ${getPopulationLabel(classification)}`,
            },
            // { icon: <CalendarMonth />, label: `Dimensiones en milímetros` },
            { icon: <CalendarMonth />, label: `${start_date} → ${end_date}` },
          ]}
        />

        {/* <Paper
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            background:
              "linear-gradient(135deg,rgba(107, 17, 203, 0.3) 0%,rgba(37, 116, 252, 0.73) 100%)",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h4" fontWeight={700} mb={1}>
                {tableTitle}
              </Typography>
              <Typography variant="body1" mb={2} sx={{ opacity: 0.9 }}>
                {description}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
                <Chip
                  icon={<PlaceIcon />}
                  label={`Lugar: ${location}`}
                  sx={{ background: "rgba(255,255,255,0.2)" }}
                />
                <Chip
                  icon={<GroupsIcon />}
                  label={`Muestra: ${size}`}
                  sx={{ background: "rgba(255,255,255,0.2)" }}
                />
                <Chip
                  icon={<CalendarMonth />}
                  label={`${start_date} → ${end_date || "-"}`}
                  sx={{ background: "rgba(255,255,255,0.2)" }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleExportClick}
              // startIcon={<FileDownloadIcon />}
              sx={{
                bgcolor: "white",
                color: "#2575fc",
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              Exportar
            </Button>
          </Box>
        </Paper> */}

        <Box
          display="flex"
          flexWrap="wrap"
          // justifyContent="space-between"
          gap={2}
          mt={4}
          mb={2}
        >
          <Box sx={{ width: "500px" }}>
            <Search
              text="Buscar dimensión"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            {/* <Button variant="contained" onClick={handleExportClick}>
            Exportar…
          </Button> */}
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
        </Box>
        <Paper>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table
              stickyHeader
              size="small"
              sx={{ borderCollapse: "collapse" }}
            >
              {/* <caption>Dimensiones en milímetros (mm), peso en kilogramos (kg). Fuente: ISO 7250-1</caption> */}
              {/* <caption style={{ captionSide: 'bottom', textAlign: 'left', padding: '8px' }}>
        <Typography variant="caption" color="text.secondary">
          Dimensiones en milímetros (mm), peso en kilogramos (kg). Fuente: ISO 7250-1
        </Typography>
      </caption> */}

              <TableHead>
                {/* Nivel 1: Género */}
                <TableRow>
                  <TableCell
                    rowSpan={3}
                    align="left"
                    sx={{
                      border: "1px solid #e0e0e0",
                      bgcolor: "background.paper",
                      minWidth: 200,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "dimension"}
                      direction={order}
                      onClick={() => handleSort("dimension")}
                      sx={{ fontWeight: 600 }}
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
                      // sx={{ border: "1px solid #E5E7EB" }}
                      sx={{
                        // bgcolor: g === 'M' ? '#e3f2fd' : g === 'F' ? '#fce4ec' : '#e8f5e9',
                        fontWeight: 600,
                        border: "1px solid #E5E7EB",
                        bgcolor: "background.paper",
                      }}
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
                        // sx={{ border: "1px solid #E5E7EB" }}
                        sx={{
                          fontWeight: 600,
                          border: "1px solid #E5E7EB",
                          bgcolor: "background.paper",
                        }}
                      >
                        {String(r)}
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
                          sx={{
                            border: "1px solid #E5E7EB",
                            py: 1,
                            bgcolor: "background.paper",
                            fontWeight: 600,
                          }}
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
                      sx={{
                        border: "1px solid #E5E7EB",
                        py: 1,
                        fontWeight: 600,
                      }}
                      align="left"
                    >
                      {row.dimension}
                    </TableCell>

                    {genders.map((g) =>
                      ageRanges.map((r) =>
                        statsCols.map((stat) => {
                          const genderKey: string = g as string;
                          const rangeKey: string = r as string;
                          const statsBlock = row.by_gender[genderKey]?.[rangeKey];
                          const value =
                            stat === "mean"
                              ? statsBlock?.mean
                              : stat === "sd"
                                ? statsBlock?.sd
                                : statsBlock?.percentiles[
                                    stat.replace("p", "")
                                  ];
                          return (
                            <TableCell
                              key={`${row.dimension}-${g}-${r}-${stat}`}
                              align="right"
                              sx={{
                                border: "1px solid #E5E7EB",
                                py: 1,
                                fontWeight: 500,
                              }}
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

          <Box display="flex" justifyContent="space-between" mt={1}>
            <caption
              style={{
                captionSide: "bottom",
                textAlign: "left",
                padding: "10px",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Dimensiones en milímetros (mm), peso en kilogramos (kg). Fuente:
                ISO 7250-1
              </Typography>
            </caption>
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
      </TabPanel>
      {/* GRAFICO DE LINEAS PARA PERCENTILES */}
      <TabPanel value={tabIndex} index={1}>
        {/* CONTROLES para seleccionar dimensión/género */}
        <Box display="flex" gap={2} mb={3}>
          <FormControl size="small">
            <InputLabel>Dimensión</InputLabel>
            <Select
              value={chartDim}
              label="Dimensión"
              onChange={(e) => setChartDim(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              {data.map((r) => (
                <MenuItem key={r.dimension} value={r.dimension}>
                  {r.dimension}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Género</InputLabel>
            <Select
              value={chartGender}
              label="Género"
              onChange={(e) => setChartGender(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              {genders.map((g) => (
                <MenuItem key={g} value={g}>
                  {g === "M" ? "Hombres" : g === "F" ? "Mujeres" : "Mixto"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* EL GRÁFICO con datos reales */}
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <PercentilesLineChart
            series={chartSeries}
            width="100%"
            height={400}
          />
        </Paper>
      </TabPanel>

      {/** GRÁFICO DE COMPARACIÓN DE GÉNERO */}
      <TabPanel value={tabIndex} index={2}>
        <Box display="flex" gap={2} mb={3}>
          <FormControl size="small">
            <InputLabel>Dimensión</InputLabel>
            <Select
              value={chartDim}
              label="Dimensión"
              onChange={(e) => setChartDim(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              {data.map((r) => (
                <MenuItem key={r.dimension} value={r.dimension}>
                  {r.dimension}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selector de percentil - NUEVO */}
          <FormControl size="small">
            <InputLabel>Percentil</InputLabel>
            <Select
              value={selectedPercentile}
              label="Percentil"
              onChange={(e) => setSelectedPercentile(Number(e.target.value))}
              sx={{ minWidth: 120 }}
            >
              {percentilesList.map((p) => (
                <MenuItem key={p} value={p}>
                  P{p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {chartDim && (
          // <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <GenderComparisonChart
            data={comparisonData}
            dimension={chartDim}
            percentile={selectedPercentile}
            chartDim={chartDim}
            location={location}
            start_date={start_date}
            end_date={end_date || "-"}
            tableTitle={tableTitle}
            size={size}
          />
          // </Paper>
        )}
      </TabPanel>
    </Box>
  );
};

export default AnthropometricTable;
