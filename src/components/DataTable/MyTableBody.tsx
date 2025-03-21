// TableBody.tsx
import React from 'react';
import { TableBody, TableRow, TableCell, Checkbox } from '@mui/material';
import { Person } from '../../types';
// import { Person } from './types';

interface TableBodyProps {
  visibleRows: Person[];
  selected: readonly number[];
  dimensions: string[];
  handleClick: (id: number) => void;
}

// Definir la interfaz para los datos de las dimensiones

// Definir la interfaz para los datos de una persona
// interface Person {
//   id: number;
//   name: string;
//   dimensions: DimensionData;
// }

const MyTableBody: React.FC<TableBodyProps> = ({
  visibleRows,
  selected,
  dimensions,
  handleClick,
}) => {
  return (
    <TableBody>
      {visibleRows.map((row, index) => {
        const isItemSelected = selected.includes(row.id);
        const labelId = `enhanced-table-checkbox-${index}`;

        return (
          <TableRow
            hover
            onClick={() => handleClick(row.id)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={isItemSelected}
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </TableCell>
            <TableCell component="th" id={labelId} scope="row" padding="none">
              {row.name}
            </TableCell>
            {dimensions.map((dimension) => (
              <TableCell key={dimension} align="right">
                {row.dimensions[dimension] || ''}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default MyTableBody;