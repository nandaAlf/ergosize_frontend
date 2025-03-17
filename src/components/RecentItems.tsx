import * as React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const RecentItems: React.FC = () => {
  const recentGroups = ['Grupo 1', 'Grupo 2', 'Grupo 3'];
  const recentTables = ['Tabla 1', 'Tabla 2', 'Tabla 3'];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Grupos Recientes
      </Typography>
      <List>
        {recentGroups.map((group, index) => (
          <ListItem key={index}>
            <ListItemText primary={group} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Tablas Recientes
      </Typography>
      <List>
        {recentTables.map((table, index) => (
          <ListItem key={index}>
            <ListItemText primary={table} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecentItems;