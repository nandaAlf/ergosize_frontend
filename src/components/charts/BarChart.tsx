import { BarChart } from '@mui/x-charts/BarChart';

export const ComparisonChart = ({ data }) => {
  // Datos de ejemplo procesados desde tu API
  const chartData = {
    series: [
      { data: [165, 178, 182], label: 'Hombres' },
      { data: [155, 162, 168], label: 'Mujeres' },
    ],
    xAxis: [{ scaleType: 'band', data: ['20-29', '30-39', '40-49'] }],
  };

  return (
    <BarChart
      series={chartData.series}
      xAxis={chartData.xAxis}
      height={400}
      colors={['#1976d2', '#e91e63']} // Colores del tema MUI
    />
  );
};