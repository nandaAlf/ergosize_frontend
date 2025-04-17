import * as React from 'react';
import { Box, Typography } from '@mui/material';
import ButtonGroup from '../components/ButtonGroup';
import RecentItems from '../components/RecentItems';
import ExcelUploade from '../components/ExcelUploade';

const Home: React.FC = () => {
  const handleGroupsClick = () => {
    console.log('Mis Grupos clickeado');
  };

  const handleTablesClick = () => {
    console.log('Mis Tablas clickeado');
  };

  return (
    <Box sx={{ p: 3 }}>
       <ExcelUploade/>
      <Typography variant="h4" gutterBottom>
        Bienvenido a la Gestión Antropométrica
      </Typography>
      <Typography variant="body1" gutterBottom>
        Esta aplicación te permite gestionar tus datos antropométricos de manera eficiente.
      </Typography>
      <ButtonGroup onGroupsClick={handleGroupsClick} onTablesClick={handleTablesClick} />
      <RecentItems />
    </Box>
  );
};

export default Home;