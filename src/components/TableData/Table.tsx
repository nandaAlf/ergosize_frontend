/* eslint-disable @typescript-eslint/no-unused-vars */
// Table.tsx
import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
  Checkbox,
  TableHead,
  TableSortLabel,
} from "@mui/material";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";
import { useTable } from "../../hooks/useTable";
import { Dimension, GroupedDimensions, Person } from "../../types";
import { useState } from "react";
import PersonForm from "../Forms/PersonForm";

import { FilterPanelToobar } from "./FilterPanelToolbar";
import { deleteMeasurements } from "../../service/service";
import { useNotify } from "../../hooks/useNotifications";
import { useConfirmDialog } from "../../hooks/useConfirmation";

// interface TableProps {
//   dimensions: GroupedDimensions;
//   persons: Person[];
//   study_id: number;
//   study_name: string;
//   size: number;
//   current_size: number;
//   searchTerm: string; // Término de búsqueda
//   onSearchTermChange: (value: string) => void;
//   onRefresh: () => void;
// }

// export const TableComponent: React.FC<TableProps> = ({
//   dimensions: groupedDimensions,
//   persons,
//   study_id,
//   study_name,
//   searchTerm,
//   onSearchTermChange,
//   size,
//   current_size,
//   onRefresh,
// }) => {
// const {
//   order,
//   orderBy,
//   selected,
//   page,
//   dense,
//   rowsPerPage,
//   handleRequestSort,
//   handleSelectAllClick,
//   handleClick,
//   handleChangePage,
//   handleChangeRowsPerPage,
//   handleChangeDense,
//   emptyRows,
//   visibleRows,
//   clearSelected,
// } = useTable(persons);

//   // const headCells = [
//   //   {
//   //     id: "name",
//   //     numeric: false,
//   //     disablePadding: true,
//   //     label: "Name",
//   //   },
//   //   ...dimensions.map((dimension) => ({
//   //     id: dimension.name || "default_id",
//   //     numeric: true,
//   //     disablePadding: false,
//   //     label: `${dimension.name} (${dimension.initial})`,
//   //   })),
//   // ];
//   const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
//   const [openPersonForm, setOpenPersonForm] = useState(false);
//   const [editPerson, setEditPerson] = useState(false);

//   // Preparar categorías y dimensiones planas

//   const categories = Object.entries(groupedDimensions); // [ [category, dims], ... ]
//   const flatDimensions = categories.flatMap(([, dims]) => dims);

//   const notify = useNotify();
//   const { confirm, dialog } = useConfirmDialog();
//   const handleAddPerson = () => {
//     if (current_size < size)
//       setOpenPersonForm(true); // Abrir el diálogo
//     else {
//       notify.warning("Este estudio ya está completo");
//     }
//   };
//   const handleEditPerson = () => {
//     // setEditPerson(true); // Abrir el diálogo
//     if (selected.length === 1) {
//       // Solo permitir editar si hay una fila seleccionada
//       const personToEdit = persons.find((p) => p.id === selected[0]);
//       if (personToEdit) {
//         setSelectedPerson(personToEdit); // Guardar la persona seleccionada
//         setEditPerson(true); // Abrir el diálogo en modo edición
//         setOpenPersonForm(true);
//       }
//     } else {
//       alert("Selecciona una sola fila para editar.");
//     }
//   };
//   const handleDeletePerson = async () => {
//     for (const select of selected) {
//       try {
//         // Buscar la persona por ID
//         const personToDelete = persons.find((person) => person.id === select);

//         const isConfirmed = await confirm({
//           title: "Eliminar Persona",
//           description: `¿Estás seguro de querer eliminar a ${personToDelete?.name || "Nombre no encontrado"} del estudio?`,
//           acceptLabel: "Eliminar",
//           cancelLabel: "Cancelar",
//         });

//         if (isConfirmed) {
//           await deleteMeasurements(study_id, select);
//           onRefresh();
//           notify.success(
//             `Persona ${personToDelete?.name || ""} eliminada correctamente`
//           );
//           clearSelected(); // <-- Aquí la novedad
//         }
//       } catch (error) {
//         console.error("Error al eliminar persona:", error);
//         notify.error("Error al eliminar la persona");
//       }
//     }
//   };

//   const handleClosePersonForm = () => {
//     setOpenPersonForm(false);
//     setEditPerson(false);
//   };

//   const params = new URLSearchParams({
//     study_id: study_id.toString(),
//     person_id: selected.length > 0 ? selected[0].toString() : "",
//   });

//   return (
//     <Box
//       sx={
//         {
//           // width: "100%",
//           // width: "calc(100% - 40px)", // evitar overflow horizontal
//           // boxSizing: "border-box",
//           // padding: "25px",
//           // borderRadius: "5px",
//           // margin: "40px 20px",
//           // border: "1px solid rgba(37, 100, 235, 0.2)",
//           // backgroundColor: "white", // opcional para mejor contraste
//         }
//       }
//     >
//       {/* <Paper sx={{ mb: 2 }}> */}
//       <EnhancedTableToolbar
//         numSelected={selected.length}
//         onAddPerson={handleAddPerson}
//         onEditPerson={handleEditPerson}
//         onDeletePerson={handleDeletePerson}
//         title={study_name || "TITULO"}
//       />
//       <Box
//         sx={{
//           // padding: "25px",
//           borderRadius: "5px",
//           margin: "10px 15px",
//           // border: "1px solid rgba(2, 2, 2, 0.2)",
//         }}
//       >
//         <FilterPanelToobar
//           onOpenPersonForm={handleAddPerson}
//           searchTerm={searchTerm}
//           onSearchChange={onSearchTermChange}
//           params={params}
//         />
//       </Box>
//       <Paper
//         sx={{
//           padding: "25px",
//           borderRadius: "5px",
//           margin: "10px 40px",
//           border: "1px solid #E5E7EB",
//         }}
//         elevation={1}
//       >
//         <TableContainer sx={{ maxHeight: 400 }}>
//           <Table
//             sx={{ minWidth: 750 }}
//             aria-labelledby="tableTitle"
//             size={dense ? "small" : "medium"}
//             stickyHeader
//           >
// {/* <EnhancedTableHead
//   numSelected={selected.length}
//   order={order}
//   orderBy={orderBy}
//   onSelectAllClick={handleSelectAllClick}
//   onRequestSort={handleRequestSort}
//   rowCount={persons.length}
//   headCells={headCells}
// /> */}
//             <TableHead>
//               <TableRow>
//                 <TableCell rowSpan={2} padding="checkbox">
//                   <Checkbox
//                     indeterminate={
//                       selected.length > 0 && selected.length < persons.length
//                     }
//                     checked={
//                       persons.length > 0 && selected.length === persons.length
//                     }
//                     onChange={handleSelectAllClick}
//                   />
//                 </TableCell>
//                 <TableCell rowSpan={2}>Name</TableCell>
//                 {categories.map(([cat, dims]) => (
//                   <TableCell
//                     key={cat}
//                     align="center"
//                     colSpan={Array.isArray(dims) ? dims.length : 1}
//                   >
//                     {cat}
//                   </TableCell>
//                 ))}
//               </TableRow>
//               <TableRow>
//                 {categories.flatMap(([, dims]) =>
//                   dims
//                     ? dims.map((dim) => (
//                         <TableCell key={dim.id_dimension} align="right">
//                           {dim.initial}
//                         </TableCell>
//                       ))
//                     : []
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {visibleRows.map((person, index) => {
//                 const isItemSelected =
//                   person.id !== undefined && selected.includes(person.id);
//                 const labelId = `enhanced-table-checkbox-${index}`;

//                 return (
//                   <TableRow
//                     hover
//                     onClick={(event) => {
//                       if (person.id !== undefined) {
//                         handleClick(event, person.id);
//                       }
//                     }}
//                     role="checkbox"
//                     aria-checked={isItemSelected}
//                     tabIndex={-1}
//                     key={person.id}
//                     selected={isItemSelected}
//                     sx={{ cursor: "pointer" }}
//                   >
//                     <TableCell padding="checkbox">
//                       <Checkbox color="primary" checked={isItemSelected} />
//                     </TableCell>
//                     <TableCell
//                       component="th"
//                       id={labelId}
//                       scope="row"
//                       padding="none"
//                     >
//                       {person.name}
//                     </TableCell>
//                     {categories.flatMap(([, dims]) =>
//                       dims.map((dim) => (
//                         <TableCell key={dim.id_dimension} align="right">
//                           {person.dimensions[dim.name!] ?? ""}
//                         </TableCell>
//                       ))
//                     )}
//                   </TableRow>
//                 );
//               })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
//                   <TableCell colSpan={dimensions.length + 2} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={persons.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//         {/* </Paper> */}
//         <FormControlLabel
//           control={<Switch checked={dense} onChange={handleChangeDense} />}
//           label="Dense padding"
//         />
//       </Paper>
//       {/* <PersonForm
//         open={openPersonForm}
//         onClose={handleClosePersonForm}
//         mode={editPerson ? "edit" : "add"}
//         dimensions={dimensions}
//         studyId={study_id}
//         personId={editPerson && selectedPerson ? selectedPerson.id : undefined}
//         onRefresh={onRefresh}
//       ></PersonForm> */}
//       {dialog}
//     </Box>
//   );
// };

// interface TableProps {
//   dimensions: GroupedDimensions; // objeto categoría → array de Dimension
//   persons: Person[];
//   study_id: number;
//   study_name: string;
//   size: number;
//   current_size: number;
//   searchTerm: string;
//   onSearchTermChange: (value: string) => void;
//   onRefresh: () => void;
// }

// export const TableComponent: React.FC<TableProps> = ({
//   dimensions: groupedDimensions,
//   persons,
//   study_id,
//   study_name,
//   searchTerm,
//   onSearchTermChange,
//   size,
//   current_size,
//   onRefresh,
// }) => {
//   const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
//   const [openPersonForm, setOpenPersonForm] = useState(false);
//   const [editPerson, setEditPerson] = useState(false);

//   const notify = useNotify();
//   const { confirm, dialog } = useConfirmDialog();

//   // Preparar categorías y dimensiones planas
//   const categories = Object.entries(groupedDimensions); // [ [category, dims], ... ]
//   const flatDimensions = categories.flatMap(([, dims]) =>
//     Array.isArray(dims) ? dims : []
//   );

//   const headCells = [
//     { id: "name", disablePadding: true, numeric: false, label: "Name" },
//     ...flatDimensions.map((dim) => ({
//       id: dim.name || dim.id_dimension.toString(),
//       disablePadding: false,
//       numeric: true,
//       label: dim.initial,
//     })),
//   ];
//   const {
//     order,
//     orderBy,
//     selected,
//     page,
//     dense,
//     rowsPerPage,
//     handleRequestSort,
//     handleSelectAllClick,
//     handleClick,
//     handleChangePage,
//     handleChangeRowsPerPage,
//     handleChangeDense,
//     emptyRows,
//     visibleRows,
//     clearSelected,
//   } = useTable(persons);

//   const handleAddPerson = () => {
//     if (current_size < size) setOpenPersonForm(true);
//     else notify.warning("Este estudio ya está completo");
//   };

//   const handleEditPerson = () => {
//     if (selected.length === 1) {
//       const personToEdit = persons.find((p) => p.id === selected[0]);
//       if (personToEdit) {
//         setSelectedPerson(personToEdit);
//         setEditPerson(true);
//         setOpenPersonForm(true);
//       }
//     } else {
//       alert("Selecciona una sola fila para editar.");
//     }
//   };

//   const handleDeletePerson = async () => {
//     for (const id of selected) {
//       const personToDelete = persons.find((p) => p.id === id);
//       if (!personToDelete) continue;
//       const isConfirmed = await confirm({
//         title: "Eliminar Persona",
//         description: `¿Estás seguro de eliminar a ${personToDelete.name}?`,
//         acceptLabel: "Eliminar",
//         cancelLabel: "Cancelar",
//       });
//       if (isConfirmed) {
//         await deleteMeasurements(study_id, id);
//         onRefresh();
//         notify.success(
//           `Persona ${personToDelete.name} eliminada correctamente`
//         );
//         clearSelected();
//       }
//     }
//   };

//   const handleClosePersonForm = () => {
//     setOpenPersonForm(false);
//     setEditPerson(false);
//   };

//   const params = new URLSearchParams({
//     study_id: study_id.toString(),
//     person_id: selected.length > 0 ? selected[0].toString() : "",
//   });

//   return (
//     <Box>
//       <EnhancedTableToolbar
//         numSelected={selected.length}
//         onAddPerson={handleAddPerson}
//         onEditPerson={handleEditPerson}
//         onDeletePerson={handleDeletePerson}
//         title={study_name}
//       />
//       <Box sx={{ mx: 2 }}>
//         <FilterPanelToobar
//           onOpenPersonForm={handleAddPerson}
//           searchTerm={searchTerm}
//           onSearchChange={onSearchTermChange}
//           params={params}
//         />
//       </Box>
//       <Paper sx={{ mt: 2, p: 2 }} elevation={1}>
//         <TableContainer sx={{ maxHeight: 400 }}>
//           <Table size={dense ? "small" : "medium"} stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell rowSpan={2} padding="checkbox">
//                   <Checkbox
//                     indeterminate={
//                       selected.length > 0 && selected.length < persons.length
//                     }
//                     checked={
//                       persons.length > 0 && selected.length === persons.length
//                     }
//                     onChange={handleSelectAllClick}
//                   />
//                 </TableCell>
//                 <TableCell
//                   rowSpan={2}
//                   sortDirection={orderBy === "name" ? order : false}
//                   >
//                   Nombre
//                   </TableCell>
//                 {categories.map(([cat, dims]) => (
//                   <TableCell
//                   key={cat}
//                   align="center"
//                   colSpan={dims?.length || 1}
//                   >
//                     {cat}
//                   </TableCell>
//                 ))}
//               </TableRow>
//               {/* <TableRow>
//                 {categories.flatMap(([, dims]) =>
//                 Array.isArray(dims)
//                 ? dims.map((dim) => (
//                   <TableCell key={dim.id_dimension} align="right">
//                   {dim.initial}
//                   </TableCell>
//                   ))
//                   : []
//                   )}
//                   </TableRow> */}
//             </TableHead>
//                   <EnhancedTableHead
//                     numSelected={selected.length}
//                     order={order}
//                     orderBy={orderBy}
//                     onSelectAllClick={handleSelectAllClick}
//                     onRequestSort={handleRequestSort}
//                     rowCount={persons.length}
//                     headCells={headCells}
//                   />
//             <TableBody>
//               {visibleRows.map((person) => {
//                 const isSelected =
//                   person.id !== undefined && selected.includes(person.id);
//                 return (
//                   <TableRow
//                     hover
//                     onClick={(e) =>
//                       person.id !== undefined && handleClick(e, person.id)
//                     }
//                     role="checkbox"
//                     aria-checked={isSelected}
//                     tabIndex={-1}
//                     key={person.id}
//                     selected={isSelected}
//                   >
//                     <TableCell padding="checkbox">
//                       <Checkbox checked={isSelected} />
//                     </TableCell>
//                     <TableCell component="th" scope="row">
//                       {person.name}
//                     </TableCell>
//                     {categories.flatMap(([, dims]) =>
//                       Array.isArray(dims)
//                         ? dims.map((dim) => (
//                             <TableCell key={dim.id_dimension} align="right">
//                               {person.dimensions[dim.name!] ?? ""}
//                             </TableCell>
//                           ))
//                         : []
//                     )}
//                   </TableRow>
//                 );
//               })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
//                   <TableCell colSpan={2 + flatDimensions.length} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={persons.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//         <FormControlLabel
//           control={<Switch checked={dense} onChange={handleChangeDense} />}
//           label="Dense padding"
//         />
//       </Paper>
//       {dialog}
//     </Box>
//   );
// };

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface TableProps {
  dimensions: GroupedDimensions;
  persons: Person[];
  study_id: number;
  study_name: string;
  size: number;
  current_size: number;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onRefresh: () => void;
}

export const TableComponent: React.FC<TableProps> = ({
  dimensions: groupedDimensions,
  persons,
  study_id,
  study_name,
  searchTerm,
  onSearchTermChange,
  size,
  current_size,
  onRefresh,
}) => {
  const notify = useNotify();
  const { confirm, dialog } = useConfirmDialog();

  // Preparar categorías y dimensiones planas
  const categories = Object.entries(groupedDimensions);
  const flatDimensions = categories.flatMap(([, dims]) =>
    Array.isArray(dims) ? dims : []
  );

  // Calcular fronteras de categorías (índices 1-based)
  const categoryBoundaries = new Set<number>();
  let runningIndex = 0;
  for (const [, dims] of categories) {
    const len = Array.isArray(dims) ? dims.length : 0;
    console.log("len", len);
    runningIndex += len;
    categoryBoundaries.add(runningIndex);
  }

  // Construir headCells para sorting
  const headCells = [
    { id: "name", disablePadding: true, numeric: false, label: "Name" },
    ...flatDimensions.map((dim) => ({
      id: dim.name || dim.id_dimension.toString(),
      disablePadding: false,
      numeric: true,
      label: dim.initial,
    })),
  ];

  const {
    order,
    orderBy,
    selected,
    page,
    dense,
    rowsPerPage,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeDense,
    emptyRows,
    visibleRows,
    clearSelected,
  } = useTable(persons);

  const params = new URLSearchParams({
    study_id: study_id.toString(),
    person_id: selected[0]?.toString() ?? "",
  });

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [openPersonForm, setOpenPersonForm] = useState(false);
  const [editPerson, setEditPerson] = useState(false);
  const handleClosePersonForm = () => {
    setOpenPersonForm(false);
    setEditPerson(false);
  };
  const handleAddPerson = () => {
    if (current_size < size)
      setOpenPersonForm(true); // Abrir el diálogo
    else {
      notify.warning("Este estudio ya está completo");
    }
  };
  const handleEditPerson = () => {
    // setEditPerson(true); // Abrir el diálogo
    if (selected.length === 1) {
      // Solo permitir editar si hay una fila seleccionada
      const personToEdit = persons.find((p) => p.id === selected[0]);
      if (personToEdit) {
        setSelectedPerson(personToEdit); // Guardar la persona seleccionada
        setEditPerson(true); // Abrir el diálogo en modo edición
        setOpenPersonForm(true);
      }
    } else {
      alert("Selecciona una sola fila para editar.");
    }
  };
  const handleDeletePerson = async () => {
    for (const select of selected) {
      try {
        // Buscar la persona por ID
        const personToDelete = persons.find((person) => person.id === select);

        const isConfirmed = await confirm({
          title: "Eliminar Persona",
          description: `¿Estás seguro de querer eliminar a ${personToDelete?.name || "Nombre no encontrado"} del estudio?`,
          acceptLabel: "Eliminar",
          cancelLabel: "Cancelar",
        });

        if (isConfirmed) {
          await deleteMeasurements(study_id, select);
          onRefresh();
          notify.success(
            `Persona ${personToDelete?.name || ""} eliminada correctamente`
          );
          clearSelected(); // <-- Aquí la novedad
        }
      } catch (error) {
        console.error("Error al eliminar persona:", error);
        notify.error("Error al eliminar la persona");
      }
    }
  };

  return (
    <Box>
      <EnhancedTableToolbar
        numSelected={selected.length}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        title={study_name || "TITULO"}
      />
      <FilterPanelToobar
        onOpenPersonForm={handleAddPerson}
        searchTerm={searchTerm}
        onSearchChange={onSearchTermChange}
        params={params}
      />
      <Paper
        sx={{
          padding: "25px",
          borderRadius: "5px",
          margin: "10px 40px",
          border: "1px solid #E5E7EB",
        }}
        elevation={1}
      >
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table size={dense ? "small" : "medium"} stickyHeader>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < persons.length
                    }
                    checked={
                      persons.length > 0 && selected.length === persons.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sortDirection={orderBy === "name" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "name")}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell> */}
                <TableCell colSpan={2} align="center"></TableCell>
                {categories.map(([cat, dims], grpIdx) => {
                  const start =
                    categories
                      .slice(0, grpIdx)
                      .reduce(
                        (sum, [, d]) => sum + (Array.isArray(d) ? d.length : 0),
                        0
                      ) + 1; // 1-based index of first column in group
                  const end =
                    start + (Array.isArray(dims) ? dims.length : 0) - 1;
                  return (
                    <>
                      <TableCell
                        key={cat}
                        align="center"
                        colSpan={Array.isArray(dims) ? dims.length : 0}
                        sx={{
                          borderLeft: "px solid rgba(0,0,0,0.3)",
                          borderRight: "0.5px solid rgba(0,0,0,0.3)",
                          // backgroundColor: "blue",
                          // marginlLeft:"2px"
                        }}
                      >
                        {cat}
                      </TableCell>
                    </>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < persons.length
                    }
                    checked={
                      persons.length > 0 && selected.length === persons.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sortDirection={orderBy === "name" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "name")}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                {flatDimensions.map((dim, idx) => {
                  const col = idx + 1;
                  const isBoundary = categoryBoundaries.has(col);
                  return (
                    <TableCell
                      key={dim.id_dimension}
                      align="right"
                      sortDirection={orderBy === dim.name ? order : false}
                      sx={{
                        borderRight: isBoundary
                          ? "2px solid rgba(0,0,0,0.3)"
                          : undefined,
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === dim.name}
                        direction={orderBy === dim.name ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, dim.name!)}
                      >
                        {dim.initial}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((person) => {
                const isSel = selected.includes(person.id!);
                return (
                  <TableRow
                    key={person.id}
                    hover
                    selected={isSel}
                    onClick={(e) => handleClick(e, person.id!)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSel} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {person.name}
                    </TableCell>
                    {flatDimensions.map((dim, idx) => {
                      const col = idx + 1;
                      const isBoundary = categoryBoundaries.has(col);
                      return (
                        <TableCell
                          key={dim.id_dimension}
                          align="right"
                          sx={{
                            borderRight: isBoundary
                              ? "2px solid rgba(0,0,0,0.3)"
                              : undefined,
                          }}
                        >
                          {person.dimensions[dim.name!] || ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={2 + flatDimensions.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={persons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense"
        />
      </Paper>
      <PersonForm
        open={openPersonForm}
        onClose={handleClosePersonForm}
        mode={editPerson ? "edit" : "add"}
        dimensions={groupedDimensions}
        studyId={study_id}
        // personMeasurement={}
        personId={editPerson && selectedPerson ? selectedPerson.id : undefined}
        onRefresh={onRefresh}
      ></PersonForm>
      {dialog}
    </Box>
  );
};
