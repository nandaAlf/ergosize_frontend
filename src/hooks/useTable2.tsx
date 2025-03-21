// useTable.ts
import { useState, useMemo } from 'react';
import { Dimension, Person } from '../types';

type Order = 'asc' | 'desc';



const useTable2 = (initialData: Person[], initialOrderBy = 'name') => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = initialData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const visibleRows = useMemo(() => {
    return [...initialData]
      // .sort((a, b) => {
      //   if (orderBy === 'name') {
      //     return order === 'asc'
      //       ? a.name.localeCompare(b.name)
      //       : b.name.localeCompare(a.name);
      //   } else {
      //     const aValue = Number(a.dimensions[orderBy]) || 0;
      //     const bValue = Number(b.dimensions[orderBy]) || 0;
      //     return order === 'asc' ? aValue - bValue : bValue - aValue;
      //   }
      // })
      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, initialData]);

  return {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    dense,
    visibleRows,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    setPage,
    setRowsPerPage,
    setDense,
  };
};

export default useTable2;