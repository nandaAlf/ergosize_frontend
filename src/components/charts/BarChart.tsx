// GenderComparisonChart.tsx
import { useMemo } from "react";
import { BarChart } from "@mui/x-charts";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

interface ComparisonData {
  ageRange: string;
  maleValue: number | null;
  femaleValue: number | null;
}
// Componente actualizado
// export const GenderComparisonChart: React.FC<{
//   data: ComparisonData[];
//   dimension: string;
//   percentile: number;
// }> = ({ data, dimension, percentile }) => {
//   // const GenderComparisonChartWithStats = ({ data, dimension }) => {
//   // 1. Calcular diferencias con significancia estadística
//   const comparisonResults = useMemo(() => {
//     return data
//       .map((entry) => {
//         const maleData = entry.by_gender["M"];
//         const femaleData = entry.by_gender["F"];
//         const ageRanges = Object.keys(maleData || femaleData || {});

//         return ageRanges
//           .map((age) => {
//             const male = maleData?.[age];
//             const female = femaleData?.[age];

//             if (!male || !female) return null;

//             // Cálculo de diferencia significativa (usando 1.96 SD para p<0.05)
//             const diff = male.mean - female.mean;
//             const sdCombined = Math.sqrt(
//               Math.pow(male.sd, 2) + Math.pow(female.sd, 2)
//             );
//             const isSignificant = Math.abs(diff) > 1.96 * sdCombined;

//             return {
//               ageRange: age,
//               dimension: entry.dimension,
//               maleMean: male.mean,
//               femaleMean: female.mean,
//               difference: diff,
//               isSignificant,
//               significanceLevel: isSignificant
//                 ? Math.abs(diff) > 2.58 * sdCombined
//                   ? "p<0.01"
//                   : "p<0.05"
//                 : "NS",
//             };
//           })
//           .filter(Boolean);
//       })
//       .flat();
//   }, [data]);

//   // 2. Resumen estadístico
//   const statsSummary = useMemo(() => {
//     const significant = comparisonResults.filter((r) => r.isSignificant);
//     const maleDominance = significant.filter((r) => r.difference > 0).length;
//     const femaleDominance = significant.length - maleDominance;

//     return {
//       totalComparisons: comparisonResults.length,
//       significantComparisons: significant.length,
//       maleDominancePercent: significant.length
//         ? Math.round((maleDominance / significant.length) * 100)
//         : 0,
//       largestDifference: comparisonResults.reduce((max, curr) =>
//         Math.abs(curr.difference) > Math.abs(max.difference) ? curr : curr
//       ),
//     };
//   }, [comparisonResults]);

//   // 3. Renderizado
//   return (
//     <Box>
//       {/* Gráfico de comparación */}
//       <BarChart
//         series={[
//           {
//             data: comparisonResults.map((r) => r.maleMean),
//             label: "Hombres",
//             color: "#1f77b4",
//           },
//           {
//             data: comparisonResults.map((r) => r.femaleMean),
//             label: "Mujeres",
//             color: "#e377c2",
//           },
//         ]}
//         xAxis={[
//           {
//             data: comparisonResults.map((r) => r.ageRange),
//             scaleType: "band",
//           },
//         ]}
//         yAxis={[{ label: `${dimension} (cm/kg)` }]}
//         height={400}
//       />

//       {/* Panel de significancia estadística */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 2,
//           mt: 3,
//           bgcolor: "#f8f9fa",
//           borderLeft: "4px solid #4e79a7",
//         }}
//       >
//         <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
//           Análisis Estadístico
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid size={{ sx: 12, md: 6 }}>
//             <Typography variant="body2">
//               <Box component="span" fontWeight="bold">
//                 Comparaciones válidas:
//               </Box>{" "}
//               {statsSummary.totalComparisons}
//             </Typography>
//             <Typography variant="body2">
//               <Box component="span" fontWeight="bold">
//                 Diferencias significativas:
//               </Box>{" "}
//               {statsSummary.significantComparisons} (
//               {(statsSummary.significantComparisons /
//                 statsSummary.totalComparisons) *
//                 100}
//               %)
//             </Typography>
//           </Grid>
//           <Grid size={{ sx: 12, md: 6 }}>
//             <Typography variant="body2">
//               <Box component="span" fontWeight="bold">
//                 Mayor diferencia:
//               </Box>{" "}
//               {statsSummary.largestDifference.difference.toFixed(2)} (
//               {statsSummary.largestDifference.ageRange},{" "}
//               {statsSummary.largestDifference.dimension})
//             </Typography>
//             <Typography variant="body2">
//               <Box component="span" fontWeight="bold">
//                 Dominancia:
//               </Box>{" "}
//               {statsSummary.maleDominancePercent}% hombres |{" "}
//               {100 - statsSummary.maleDominancePercent}% mujeres
//             </Typography>
//           </Grid>
//         </Grid>

//         {/* Tabla de significancia por rango */}
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Rango</TableCell>
//                 <TableCell align="right">Hombres (M)</TableCell>
//                 <TableCell align="right">Mujeres (F)</TableCell>
//                 <TableCell align="right">Diferencia (M-F)</TableCell>
//                 <TableCell align="center">Significancia</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {comparisonResults.map((row, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{row.ageRange}</TableCell>
//                   <TableCell align="right">{row.maleMean.toFixed(2)}</TableCell>
//                   <TableCell align="right">
//                     {row.femaleMean.toFixed(2)}
//                   </TableCell>
//                   <TableCell
//                     align="right"
//                     sx={{
//                       color: row.difference > 0 ? "#1f77b4" : "#e377c2",
//                       fontWeight: row.isSignificant ? "bold" : "normal",
//                     }}
//                   >
//                     {row.difference.toFixed(2)}
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       color: row.isSignificant ? "#2ca02c" : "#d62728",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {row.significanceLevel}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// };
export const GenderComparisonChart: React.FC<{
  data: ComparisonData[];
  dimension: string;
  percentile: number;
}> = ({ data, dimension, percentile }) => {
  return (
    <BarChart
      series={[
        {
          data: data.map(d => d.maleValue ?? 0),
          label: 'Hombres',
          id: 'male-series'
        },
        {
          data: data.map(d => d.femaleValue ?? 0),
          label: 'Mujeres',
          id: 'female-series'
        }
      ]}
      xAxis={[{
        data: data.map(d => d.ageRange),
        scaleType: 'band',
        label: 'Rango de edad'
      }]}
      yAxis={[{ label: `${dimension} (P${percentile})` }]}
      height={400}
      colors={['#1f77b4', '#d62728']} // Azul vs Rojo
      slotProps={{
        legend: { position: 'top' },
        bar: {
          rx: 4, // Bordes redondeados
          clipPath: `inset(0 round 4px)`
        }
      }}
      margin={{ top: 80, bottom: 80, left: 70, right: 20 }}
    />
  );
};
