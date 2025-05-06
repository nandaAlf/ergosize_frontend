import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
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
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Button,
  Paper,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Search from "../components/filtros/Search";
import { color } from "three/tsl";
import BarChartIcon from "@mui/icons-material/BarChart";
interface PercentileMap {
  [key: string]: number;
}
interface ResultRow {
  dimension: string;
  stats?: { mean: number; sd: number; percentiles: PercentileMap };
  by_gender?: {
    M?: { mean: number; sd: number; percentiles: PercentileMap };
    F?: { mean: number; sd: number; percentiles: PercentileMap };
  };
}
interface AnthropometricTableProps {
  studyId: number;
  gender?: "M" | "F" | "mixto";
  ageMin?: string;
  ageMax?: string;
  dimensions: number[];
  percentilesList: number[];
}
type Order = "asc" | "desc";
interface ColumnDef {
  id: string;
  label: string;
  getValue: (row: ResultRow) => number | string;
}

const AnthropometricTable: React.FC<AnthropometricTableProps> = ({
  studyId,
  gender,
  ageMin,
  ageMax,
  dimensions,
  percentilesList,
}) => {
  const [data, setData] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string>("dimension");
  const [order, setOrder] = useState<Order>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const isMixed = gender === "mixto";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (gender) params.set("gender", gender);
      if (ageMin) params.set("age_min", ageMin);
      if (ageMax) params.set("age_max", ageMax);
      if (dimensions.length) params.set("dimensions", dimensions.join(","));
      if (percentilesList.length)
        params.set("percentiles", percentilesList.join(","));
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/test-percentiles/${studyId}/?${params.toString()}`
        );
        setData(res.data.results || []);
      } catch {
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    studyId,
    gender,
    ageMin,
    ageMax,
    dimensions.join(),
    percentilesList.join(),
  ]);

  const columns: ColumnDef[] = useMemo(() => {
    const cols: ColumnDef[] = [
      { id: "dimension", label: "Dimensión", getValue: (r) => r.dimension },
    ];
    if (isMixed) {
      ["M", "F"].forEach((g) => {
        cols.push({
          id: `mean_${g}`,
          label: `Media ${g}`,
          getValue: (r) => r.by_gender?.[g]?.mean ?? NaN,
        });
        cols.push({
          id: `sd_${g}`,
          label: `SD ${g}`,
          getValue: (r) => r.by_gender?.[g]?.sd ?? NaN,
        });
        percentilesList.forEach((p) =>
          cols.push({
            id: `p${p}_${g}`,
            label: `${p}% ${g}`,
            getValue: (r) => r.by_gender?.[g]?.percentiles[p.toString()] ?? NaN,
          })
        );
      });
    } else {
      cols.push({
        id: "mean",
        label: "Media",
        getValue: (r) => r.stats?.mean ?? NaN,
      });
      cols.push({ id: "sd", label: "SD", getValue: (r) => r.stats?.sd ?? NaN });
      percentilesList.forEach((p) =>
        cols.push({
          id: `p${p}`,
          label: `${p}%`,
          getValue: (r) => r.stats?.percentiles[p.toString()] ?? NaN,
        })
      );
    }
    return cols;
  }, [isMixed, percentilesList]);

  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        const col = columns.find((c) => c.id === orderBy)!;
        const aV = col.getValue(a),
          bV = col.getValue(b);
        if (aV < bV) return order === "asc" ? -1 : 1;
        if (aV > bV) return order === "asc" ? 1 : -1;
        return 0;
      }),
    [data, orderBy, order, columns]
  );
  const filtered = useMemo(
    () =>
      sorted.filter((r) =>
        r.dimension.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sorted, searchTerm]
  );
  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data.length) return <Typography>No hay datos</Typography>;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          mb: 3,
          borderRadius: 2,
          // backgroundColor: '#F9FAFB',
          border: "1px solid #E5E7EB",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <BarChartIcon fontSize="large" />
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="div" gutterBottom>
            Peso, estatura y complexión
          </Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="body2">
              <Box
                component="span"
                sx={{
                  color: "text.primary",
                  fontWeight: 500 /* opcional para negrita */,
                }}
              >
                Ubicación:
              </Box>{" "}
              <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
                Cuba / Cienfuegos / UCLV
              </Box>
            </Typography>
            <Typography variant="body2">
              <Box
                component="span"
                sx={{
                  color: "text.primary",
                  fontWeight: 500 /* opcional para negrita */,
                }}
              >
                Participantes:
              </Box>{" "}
              <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
                300
              </Box>
            </Typography>
            <Typography variant="body2">
            <Box
              component="span"
              sx={{
                color: "text.primary",
                fontWeight: 500 /* opcional para negrita */,
              }}
            >
              Genero:
            </Box>{" "}
            <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
              Mixto
            </Box>
          </Typography>
            {/* <Chip label={`Ubicación: Cuba /Cienfuegos / UCLV`} size="small" />
            <Chip label={`Género: Femenino`} size="small" />
            <Chip label={`300 participantes`} size="small" /> */}
          </Stack>
        </Box>
      </Paper>

      <Box
        sx={{
          boxSizing: "border-box",
          p: 2, // 24px
          m: "40px 0",
          borderRadius: "8px",
          backgroundColor: "#fff", // fondo claro
          border: "1px solid #E5E7EB", // borde gris claro
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ width: "500px" }}>
            <Search
              text="Buscar dimensión"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Button sx={{ width: "150px" }} variant="contained">
            Exportar
          </Button>
          {/* <FormControlLabel
            control={
              <Switch
                checked={false}
                onChange={() => setOrderBy("dimension")}
              />
            }
            label="Vista compacta"
          /> */}
        </Toolbar>

        <TableContainer
          sx={{
            borderRadius: "8px",
            overflow: "hidden", // para que el borde redondeado funcione
            // border: "1px solid #E5E7EB", // mismo borde en la tabla
            backgroundColor: "white",
          }}
        >
          <Table
            size={false ? "small" : "medium"}
            sx={{
              borderCollapse: "collapse",
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((col) => {
                  const isFirstF = col.id.startsWith("mean_F");
                  return (
                    <TableCell
                      key={col.id}
                      align={col.id === "dimension" ? "left" : "right"}
                      sortDirection={orderBy === col.id ? order : false}
                      sx={
                        {
                          // border: "1px solid #E5E7EB",
                          // ...(isFirstF && {
                          //   borderLeft: "2px solid #E5E7EB",
                          //   pl: 1,
                          // }),
                        }
                      }
                    >
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={order}
                        onClick={() => {
                          const asc = orderBy === col.id && order === "asc";
                          setOrder(asc ? "desc" : "asc");
                          setOrderBy(col.id);
                        }}
                      >
                        {col.label}
                        {orderBy === col.id && (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        )}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((row, i) => (
                <TableRow key={i} hover>
                  {columns.map((col) => {
                    const isFirstF = col.id.startsWith("mean_F");
                    return (
                      <TableCell
                        key={col.id}
                        align={col.id === "dimension" ? "left" : "right"}
                        sx={
                          {
                            // border: "1px solid #E5E7EB",
                            // ...(isFirstF && {
                            //   borderLeft: "2px solid #E5E7EB",
                            //   pl: 1,
                            // }),
                          }
                        }
                      >
                        {typeof col.getValue(row) === "number"
                          ? (col.getValue(row) as number).toFixed(2)
                          : col.getValue(row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <TablePagination
            component="div"
            count={filtered.length}
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
      </Box>
    </Box>
  );
};
export default AnthropometricTable;
