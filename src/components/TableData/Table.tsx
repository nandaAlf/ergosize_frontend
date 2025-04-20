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
} from "@mui/material";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";
import { useTable } from "../../hooks/useTable";
import { Dimension, Person } from "../../types";
import { useState } from "react";
import PersonForm from "../Forms/PersonForm";
import { deleteMeasurements } from "../../api/api";
import { FilterPanelToobar } from "./FilterPanelToolbar";

interface TableProps {
  dimensions: Dimension[];
  persons: Person[];
  study_id: number;
}

export const TableComponent: React.FC<TableProps> = ({
  dimensions,
  persons,
  study_id
}) => {
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
  } = useTable(persons);

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    ...dimensions.map((dimension) => ({
      id: dimension.name || "default_id",
      numeric: true,
      disablePadding: false,
      label: `${dimension.name} (${dimension.initial})`,
    })),
  ];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [openPersonForm, setOpenPersonForm] = useState(false);
  const [editPerson, setEditPerson] = useState(false);
  const handleAddPerson = () => {
    setOpenPersonForm(true); // Abrir el diálogo
  };
  const handleEditPerson = () => {
    // setEditPerson(true); // Abrir el diálogo
    if (selected.length === 1) {
      alert("Editando persona");
      // Solo permitir editar si hay una fila seleccionada
      const personToEdit = persons.find((p) => p.id === selected[0]);
      console.log("personToEdit",personToEdit);
      if (personToEdit) {
        setSelectedPerson(personToEdit); // Guardar la persona seleccionada
        setEditPerson(true); // Abrir el diálogo en modo edición
        setOpenPersonForm(true);
        console.log("edit");
        console.log(personToEdit);
      }
    } else {
      alert("Selecciona una sola fila para editar.");
    }
  };
  const handleDeletePerson = async () => {
    console.log(persons);
    try {
      console.log("VER");
      console.log(selected);
      const studyId = 1; // ID del estudio
      // const personId = 2; // ID de la persona
      const result = await deleteMeasurements(studyId, selected[0]);
      console.log("Mediciones eliminadas:", result);
    } catch (error) {
      console.error("Error al eliminar las mediciones:", error);
    }
  };
  const handleClosePersonForm = () => {
    setOpenPersonForm(false);
    setEditPerson(false);
  };

  return (
    <Box   sx={{
      // width: "100%",
      width: "calc(100% - 40px)", // evitar overflow horizontal
      boxSizing: "border-box",
      padding: "25px",
      borderRadius: "30px",
      margin: "40px 20px",
      border: "1px solid rgba(37, 100, 235, 0.2)",
      backgroundColor: "white", // opcional para mejor contraste
    }}>
      {/* <Paper sx={{ mb: 2 }}> */}
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAddPerson={handleAddPerson}
          onEditPerson={handleEditPerson}
          onDeletePerson={handleDeletePerson}
          title={"TITULO DE LA TABLA"}
        />
      {/* <FilterPanelToobar/> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={persons.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((person, index) => {
                const isItemSelected = selected.includes(person.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, person.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={person.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {person.name}
                    </TableCell>
                    {dimensions.map((dimension) => (
                      <TableCell key={dimension.id_dimension} align="right">
                        {dimension.name? person.dimensions[dimension.name] : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={dimensions.length + 2} />
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
      {/* </Paper> */}
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <PersonForm
        open={openPersonForm}
        onClose={handleClosePersonForm}
        mode={editPerson ? "edit" : "add"}
        dimensions={dimensions}
        studyId={study_id} 
        personId={editPerson && selectedPerson ?  selectedPerson.id : undefined}
      ></PersonForm>
      {/* {/* <pre>{JSON.stringify(persons)}</pre> */}
      {/* {editPerson ? <pre>{JSON.stringify(selectedPerson)}</pre> : <></>} */}
    </Box>
  );
};
