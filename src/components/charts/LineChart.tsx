import React, { useState } from "react";
import { LineChart } from "@mui/x-charts";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Definición de interfaces
interface DataPoint {
  x: string;
  y: number | null;
}

interface Series {
  id: string;
  data: DataPoint[];
}

interface PercentilesLineChartProps {
  series: Series[];
  width?: number | string;
  height?: number;
}

// Componente del gráfico
const PercentilesLineChart: React.FC<PercentilesLineChartProps> = ({
  series,
  width = "100%",
  height = 400,
}) => {
  // Verificar si hay datos
  const hasData = series.length > 0 && series.some((s) => s.data.length > 0);

  // Extraer todos los rangos de edad únicos y ordenarlos
  const allAgeRanges = Array.from(
    new Set(series.flatMap((s) => s.data.map((d) => d.x)))
  ).sort();
  // const allAgeRanges = [...new Set(/*...*/)].sort(
  //   (a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0])
  // );
  // Crear estructura de datos para MUI
  const chartSeries = series.map((serie) => ({
    type: "line" as const,
    id: serie.id,
    label: `${serie.id.replace("p", "")}%`,
    data: allAgeRanges.map((age) => {
      const point = serie.data.find((d) => d.x === age);
      return point?.y ?? null;
    }),
    connectNulls: true,
    showMark: true,
    color:
      serie.id === "p3"
        ? "#1f77b4"
        : serie.id === "p15"
          ? "#ff7f0e"
          : serie.id === "p50"
            ? "#2ca02c"
            : serie.id === "p85"
              ? "#d62728"
              : serie.id === "p97"
                ? "#9467bd"
                : "#8c564b",
  }));

  return (
    <Box mb={4} sx={{ width, height, minHeight: 400 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
      >
        Evolución de Percentiles
      </Typography>

      {hasData ? (
        // <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <>
          <LineChart
            series={chartSeries}
            xAxis={[
              {
                data: allAgeRanges,
                scaleType: "point",
                id: "ageRanges",
                label: "Rango de edad",
              },
            ]}
            yAxis={[
              {
                id: "percentiles",
                label: "Valor (mm/kg)",
              },
            ]}
            height={height}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            grid={{ vertical: true, horizontal: true }}
            legend={{ position: "top" }}
            tooltip={{ trigger: "axis" }}
            referenceLines={[{ y: 0, lineStyle: { stroke: "#ccc" } }]}
          />
          {/* </Paper> */}
        </>
      ) : (
        <Box
          height={height}
          display="flex"
          alignItems="center"
          justifyContent="center"
          // bgcolor="#fafafa"
          border="1px dashed #e0e0e0"
          borderRadius={1}
        >
          <Typography variant="body1" color="textSecondary">
            No hay datos disponibles para mostrar
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// export default PercentilesDemo;

export default PercentilesLineChart;

// Componente de demostración con datos fijos
const PercentilesDemo: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState("Peso");
  const [selectedGender, setSelectedGender] = useState("M");

  // Datos fijos para demostración
  const fixedData: Series[] = [
    {
      id: "p3",
      data: [
        { x: "0-3 meses", y: 3.2 },
        { x: "4-6 meses", y: 4.1 },
        { x: "7-9 meses", y: 5.0 },
        { x: "10-12 meses", y: 5.8 },
        { x: "13-15 meses", y: 6.5 },
      ],
    },
    {
      id: "p15",
      data: [
        { x: "0-3 meses", y: 4.0 },
        { x: "4-6 meses", y: 5.2 },
        { x: "7-9 meses", y: 6.3 },
        { x: "10-12 meses", y: 7.1 },
        { x: "13-15 meses", y: 7.8 },
      ],
    },
    {
      id: "p50",
      data: [
        { x: "0-3 meses", y: 5.5 },
        { x: "4-6 meses", y: 6.8 },
        { x: "7-9 meses", y: 8.0 },
        { x: "10-12 meses", y: 8.9 },
        { x: "13-15 meses", y: 9.7 },
      ],
    },
    {
      id: "p85",
      data: [
        { x: "0-3 meses", y: 6.8 },
        { x: "4-6 meses", y: 8.0 },
        { x: "7-9 meses", y: 9.5 },
        { x: "10-12 meses", y: 10.5 },
        { x: "13-15 meses", y: 11.3 },
      ],
    },
    {
      id: "p97",
      data: [
        { x: "0-3 meses", y: 7.5 },
        { x: "4-6 meses", y: 9.0 },
        { x: "7-9 meses", y: 10.7 },
        { x: "10-12 meses", y: 11.8 },
        { x: "13-15 meses", y: 12.6 },
      ],
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
        bgcolor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#2c3e50", mb: 3 }}
      >
        Gráfico de Percentiles
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, color: "#34495e" }}>
          Datos de ejemplo: Percentiles de peso infantil
        </Typography>

        <Box display="flex" gap={3} mb={4} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Dimensión</InputLabel>
            <Select
              value={selectedDimension}
              label="Dimensión"
              onChange={(e) => setSelectedDimension(e.target.value)}
            >
              <MenuItem value="Peso">Peso (kg)</MenuItem>
              <MenuItem value="Talla">Talla (cm)</MenuItem>
              <MenuItem value="IMC">Índice de Masa Corporal</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Género</InputLabel>
            <Select
              value={selectedGender}
              label="Género"
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
              <MenuItem value="Mixto">Mixto</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <PercentilesLineChart series={fixedData} width="100%" height={450} />

        <Box mt={4}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Este gráfico muestra la evolución de diferentes percentiles de peso
            infantil a lo largo de los primeros 15 meses de vida.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Los percentiles representan:
            <span style={{ color: "#1f77b4", fontWeight: "bold" }}> P3 </span>
            <span style={{ color: "#ff7f0e", fontWeight: "bold" }}> P15 </span>
            <span style={{ color: "#2ca02c", fontWeight: "bold" }}> P50 </span>
            <span style={{ color: "#d62728", fontWeight: "bold" }}> P85 </span>
            <span style={{ color: "#9467bd", fontWeight: "bold" }}> P97 </span>
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#34495e" }}>
          Interpretación del gráfico
        </Typography>
        <ul style={{ paddingLeft: 20, color: "#555" }}>
          <li>
            El <strong style={{ color: "#2ca02c" }}>percentil 50 (P50)</strong>{" "}
            representa el valor medio
          </li>
          <li>
            Los percentiles <strong style={{ color: "#1f77b4" }}>P3</strong> y{" "}
            <strong style={{ color: "#9467bd" }}>P97</strong> muestran los
            límites inferior y superior de la distribución normal
          </li>
          <li>
            El área entre <strong style={{ color: "#ff7f0e" }}>P15</strong> y{" "}
            <strong style={{ color: "#d62728" }}>P85</strong> representa la
            mayoría de la población
          </li>
          <li>
            Este tipo de gráficos es esencial para el seguimiento del
            crecimiento infantil
          </li>
        </ul>
      </Box>
    </Box>
  );
};
