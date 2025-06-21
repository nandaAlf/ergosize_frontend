// GenderComparisonChart.tsx
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";

interface ComparisonData {
  ageRange: string;
  maleValue: number | null;
  femaleValue: number | null;
}

export const GenderComparisonChart: React.FC<{
  data: ComparisonData[];
  dimension: string;
  percentile: number;
  chartDim: string;
  location: string;
  start_date: string;
  end_date: string;
  tableTitle: string;
  size: number;
}> = ({
  data,
  dimension,
  percentile,
  chartDim,
  location,
  start_date,
  end_date,
  tableTitle,
  size,
}) => {
  return (
    <Box mb={4} sx={{ minHeight: 400 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
      >
        Comparación por sexos
      </Typography>

      {chartDim ? (
        <>
          <BarChart
            series={[
              {
                data: data.map((d) => d.maleValue ?? 0),
                label: "Hombres",
                id: "male-series",
              },
              {
                data: data.map((d) => d.femaleValue ?? 0),
                label: "Mujeres",
                id: "female-series",
              },
            ]}
            xAxis={[
              {
                data: data.map((d) => d.ageRange),
                scaleType: "band",
                label: "Rango de edad",
              },
            ]}
            yAxis={[{ label: `${dimension} (P${percentile})` }]}
            height={400}
            colors={["#1f77b4", "#d62728"]} // Azul vs Rojo
            slotProps={{
              // legend: { position: "top" },
              bar: {
                rx: 4, // Bordes redondeados
                clipPath: `inset(0 round 4px)`,
              },
            }}
            margin={{ top: 0, bottom: 50, left: 70, right: 20 }}
          />
          <Box>
            {/* <Divider sx={{ mb: 2 }} /> */}
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              <Box
                component="span"
                sx={{ color: "#1f77b4", fontWeight: "bold" }}
              >
                ● Hombres
              </Box>{" "}
              vs
              <Box
                component="span"
                sx={{ color: "#e377c2", fontWeight: "bold" }}
              >
                {" "}
                ● Mujeres
              </Box>
            </Typography>

            <Typography variant="body2" paragraph>
              Comparación del percentil {percentile} para{" "}
              {chartDim.toLowerCase()} en {location}. Los datos cubren el
              período {new Date(start_date).toLocaleDateString()} al{" "}
              {new Date(end_date).toLocaleDateString()}.
            </Typography>

            <Box mt={1} textAlign="right">
              <Typography variant="caption" color="textSecondary">
                Fuente: {tableTitle} | Muestra: {size} participantes
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          height={400}
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
