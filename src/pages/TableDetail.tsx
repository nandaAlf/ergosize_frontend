import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  alpha,
  Box,
  CircularProgress,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import LongMenu from "../components/Menu";
interface PercentileMap {
  [key: string]: number;
}

interface ResultRow {
  dimension: string;
  dimension_id: number;
  mean: number;
  sd: number;
  percentiles: PercentileMap;
}

interface AnthropometricTableProps {
  studyId: number;
  gender?: string;
  ageMin?: string;
  ageMax?: string;
  dimensions: number[];
  percentilesList: number[];
}

type Order = "asc" | "desc";
const params = new URLSearchParams();
interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
  disablePadding?: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(
  order: Order,
  orderBy: string,
  percentilesList: number[]
): (a: ResultRow, b: ResultRow) => number {
  return (a, b) => {
    let valueA: any;
    let valueB: any;

    if (orderBy.startsWith("percentile_")) {
      const percentile = orderBy.replace("percentile_", "");
      valueA = a.percentiles[percentile] || 0;
      valueB = b.percentiles[percentile] || 0;
    } else {
      // Validamos que orderBy sea una clave de ResultRow
      const validKeys: (keyof ResultRow)[] = ["dimension", "mean", "sd"];
      const safeOrderBy = validKeys.includes(orderBy as keyof ResultRow)
        ? (orderBy as keyof ResultRow)
        : "dimension";

      valueA = a[safeOrderBy];
      valueB = b[safeOrderBy];
    }

    const compareResult = valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
    return order === "desc" ? compareResult : -compareResult;
  };
}
interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  studyId: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, studyId } = props;
  const handleMenuAction = async (action: string) => {
    const baseUrl = `http://127.0.0.1:8000/api/export`;
    const url = `${baseUrl}/${
      action.includes("Excel") ? "excel" : "pdf"
    }/${studyId}/?${params.toString()}`;

    try {
      const response = await axios.get(url, {
        responseType: "blob", // 👈 necesario para archivos
      });

      // Crear un blob y un enlace para forzar la descarga
      const fileType = action.includes("Excel")
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";

      const extension = action.includes("Excel") ? "xlsx" : "pdf";

      const blob = new Blob([response.data], { type: fileType });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `percentiles_study_${studyId}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl); // Limpieza
    } catch (err) {
      console.error(`Error al descargar archivo ${action}:`, err);
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionados
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Resultados del Estudio
        </Typography>
      )}

      <Tooltip title="Eliminar">
        <LongMenu
          onAction={handleMenuAction}
          options={["Exportar a Excel", "Exportar a PDF"]}
        />
      </Tooltip>
    </Toolbar>
  );
}

const TableDetail: React.FC<AnthropometricTableProps> = ({
  studyId,
  gender,
  ageMin,
  ageMax,
  dimensions,
  percentilesList,
}) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("dimension");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  // const params = new URLSearchParams();
  const headCells: HeadCell[] = useMemo(
    () => [
      {
        id: "dimension",
        numeric: false,
        disablePadding: true,
        label: "Dimensión",
      },
      {
        id: "mean",
        numeric: true,
        label: "Media",
      },
      {
        id: "sd",
        numeric: true,
        label: "SD",
      },
      ...percentilesList.map((p) => ({
        id: `percentile_${p.toFixed(1)}`,
        numeric: true,
        label: `${p}%`,
      })),
    ],
    [percentilesList]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      // const params = new URLSearchParams();
      if (gender) params.append("gender", gender);
      if (ageMin) params.append("age_min", ageMin);
      if (ageMax) params.append("age_max", ageMax);
      if (dimensions.length > 0)
        params.append("dimensions", dimensions.join(","));
      if (percentilesList.length > 0)
        params.append("percentiles", percentilesList.join(","));

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/test-percentiles/${studyId}/?${params.toString()}`
        );
        setResults(response.data?.results || []);
        console.log("Revisar", response.data);
      } catch (err) {
        console.error("Error al obtener datos de percentiles:", err);
        setError("No se pudieron obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studyId, gender, ageMin, ageMax, dimensions, percentilesList]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = results.map((n) => n.dimension);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, dimension: string) => {
    const selectedIndex = selected.indexOf(dimension);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, dimension);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // const sortedResults = useMemo(
  //   () =>
  //     [...results].sort((a, b) => {
  //       const comparator = getComparator(order, orderBy);
  //       return comparator(a, b);
  //     }),
  //   [results, order, orderBy],
  // );
  const sortedResults = useMemo(
    () => [...results].sort(getComparator(order, orderBy, percentilesList)),
    [results, order, orderBy, percentilesList]
  );

  const visibleRows = useMemo(
    () =>
      sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedResults, page, rowsPerPage]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box mt={4}>
        <Typography>
          No hay resultados disponibles para los filtros seleccionados.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} studyId={studyId} />
        <TableContainer>
          <Table size={dense ? "small" : "medium"} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={results.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.dimension);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.dimension)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.dimension}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.dimension}
                    </TableCell>
                    <TableCell align="right">{row.mean.toFixed(2)}</TableCell>
                    <TableCell align="right">{row.sd.toFixed(2)}</TableCell>
                    {percentilesList.map((p) => (
                      <TableCell key={p} align="right">
                        {row.percentiles?.[p.toFixed(1)] !== undefined
                          ? row.percentiles[p.toFixed(1)].toFixed(2)
                          : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={results.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Vista compacta"
      />
    </Box>
  );
};

export default TableDetail;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";

// interface PercentileMap {
//   [key: string]: number;
// }

// interface ResultRow {
//   dimension: string;
//   mean: number;
//   sd: number;
//   percentiles: PercentileMap;
// }

// interface AnthropometricTableProps {
//   studyId: number;
//   gender?: string;
//   ageMin?: string;
//   ageMax?: string;
//   dimensions: number[];
//   percentilesList: number[];
// }

// const TableDetail: React.FC<AnthropometricTableProps> = ({
//   studyId,
//   gender,
//   ageMin,
//   ageMax,
//   dimensions,
//   percentilesList,
// }) => {
//   const [loading, setLoading] = useState(true);
//   const [results, setResults] = useState<ResultRow[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {

//       setLoading(true);
//       setError(null);
//       setResults([]);

//       const params = new URLSearchParams();
//       if (gender) params.append("gender", gender);
//       if (ageMin) params.append("age_min", ageMin);
//       if (ageMax) params.append("age_max", ageMax);
//       if (dimensions.length > 0) params.append("dimensions", dimensions.join(","));
//       if (percentilesList.length > 0) params.append("percentiles", percentilesList.join(","));

//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/test-percentiles/${studyId}/?${params.toString()}`
//         );
//         console.log("Revisar", response.data);
//         setResults(response.data?.results || []);
//       } catch (err) {
//         console.error("Error al obtener datos de percentiles:", err);
//         setError("No se pudieron obtener los datos.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [studyId, gender, ageMin, ageMax, dimensions, percentilesList]);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box mt={4}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   if (results.length === 0) {
//     return (
//       <Box mt={4}>
//         <Typography>No hay resultados disponibles para los filtros seleccionados.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box mt={4}>
//       <Typography variant="h6" gutterBottom>
//         Resultados del Estudio
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>Dimensión</strong></TableCell>
//               <TableCell align="right"><strong>Media</strong></TableCell>
//               <TableCell align="right"><strong>SD</strong></TableCell>
//               {percentilesList.map((p) => (
//                 <TableCell key={p} align="right"><strong>{p}%</strong></TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {results.map((row, idx) => (
//               <TableRow key={idx}>
//                 <TableCell>{row.dimension}</TableCell>
//                 <TableCell align="right">{row.mean.toFixed(2)}</TableCell>
//                 <TableCell align="right">{row.sd.toFixed(2)}</TableCell>
//                 {percentilesList.map((p) => (
//                   <TableCell key={p} align="right">
//                   {row.percentiles?.[p.toFixed(1)] !== undefined
//                     ? row.percentiles[p.toFixed(1)].toFixed(2)
//                     : "-"}
//                 </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default TableDetail;
