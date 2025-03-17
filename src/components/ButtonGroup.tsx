import * as React from 'react';
import { Button, Box } from '@mui/material';

interface ButtonGroupProps {
  onGroupsClick: () => void;
  onTablesClick: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ onGroupsClick, onTablesClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
      <Button variant="contained" onClick={onGroupsClick}>
        Mis Grupos
      </Button>
      <Button variant="contained" onClick={onTablesClick}>
        Mis Tablas
      </Button>
    </Box>
  );
};

export default ButtonGroup;