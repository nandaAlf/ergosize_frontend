import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface PercentileMap {
  [key: string]: number;
}

interface ResultRow {
  dimension: string;
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

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);
      setError(null);
      setResults([]);

      const params = new URLSearchParams();
      if (gender) params.append("gender", gender);
      if (ageMin) params.append("age_min", ageMin);
      if (ageMax) params.append("age_max", ageMax);
      if (dimensions.length > 0) params.append("dimensions", dimensions.join(","));
      if (percentilesList.length > 0) params.append("percentiles", percentilesList.join(","));
      
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/test-percentiles/${studyId}/?${params.toString()}`
        );
        console.log("Revisar", response.data);
        setResults(response.data?.results || []);
      } catch (err) {
        console.error("Error al obtener datos de percentiles:", err);
        setError("No se pudieron obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studyId, gender, ageMin, ageMax, dimensions, percentilesList]);

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
        <Typography>No hay resultados disponibles para los filtros seleccionados.</Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Resultados del Estudio
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Dimensión</strong></TableCell>
              <TableCell align="right"><strong>Media</strong></TableCell>
              <TableCell align="right"><strong>SD</strong></TableCell>
              {percentilesList.map((p) => (
                <TableCell key={p} align="right"><strong>{p}%</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.dimension}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableDetail;
