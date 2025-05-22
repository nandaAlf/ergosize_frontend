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

import { FilterPanelToobar } from "./FilterPanelToolbar";
import { deleteMeasurements } from "../../service/service";
import { useNotify } from "../../hooks/useNotifications";
import { useConfirmDialog } from "../../hooks/useConfirmation";

interface TableProps {
  dimensions: Dimension[];
  persons: Person[];
  study_id: number;
  study_name: string;
  size: number;
  current_size:number;
  searchTerm: string; // Término de búsqueda
  onSearchTermChange: (value: string) => void;
  onRefresh: () => void;
}

export const TableComponent: React.FC<TableProps> = ({
  dimensions,
  persons,
  study_id,
  study_name,
  searchTerm,
  onSearchTermChange,
  size,
  current_size,
  onRefresh,
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
    clearSelected,
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
  const notify = useNotify();
  const { confirm, dialog } = useConfirmDialog();
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

  const handleClosePersonForm = () => {
    setOpenPersonForm(false);
    setEditPerson(false);
  };

  const params = new URLSearchParams({
    study_id: study_id.toString(),
    person_id: selected.length > 0 ? selected[0].toString() : "",
  });

  return (
    <Box
      sx={
        {
          // width: "100%",
          // width: "calc(100% - 40px)", // evitar overflow horizontal
          // boxSizing: "border-box",
          // padding: "25px",
          // borderRadius: "5px",
          // margin: "40px 20px",
          // border: "1px solid rgba(37, 100, 235, 0.2)",
          // backgroundColor: "white", // opcional para mejor contraste
        }
      }
    >
      {/* <Paper sx={{ mb: 2 }}> */}
      <EnhancedTableToolbar
        numSelected={selected.length}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        title={study_name || "TITULO"}
      />
      <Box
        sx={{
          // padding: "25px",
          borderRadius: "5px",
          margin: "10px 15px",
          // border: "1px solid rgba(2, 2, 2, 0.2)",
        }}
      >
        <FilterPanelToobar
          onOpenPersonForm={handleAddPerson}
          searchTerm={searchTerm}
          onSearchChange={onSearchTermChange}
          params={params}
        />
      </Box>
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
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            stickyHeader
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
                const isItemSelected = person.id !== undefined && selected.includes(person.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      if (person.id !== undefined) {
                        handleClick(event, person.id);
                      }
                    }}
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
                        {dimension.name
                          ? person.dimensions[dimension.name]
                          : ""}
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
      </Paper>
      <PersonForm
        open={openPersonForm}
        onClose={handleClosePersonForm}
        mode={editPerson ? "edit" : "add"}
        dimensions={dimensions}
        studyId={study_id}
        personId={editPerson && selectedPerson ? selectedPerson.id : undefined}
        onRefresh={onRefresh}
      ></PersonForm>
      {dialog} {/* Renderiza el modal de confirmación */}
      {/* {/* <pre>{JSON.stringify(persons)}</pre> */}
      {/* {editPerson ? <pre>{JSON.stringify(selectedPerson)}</pre> : <></>} */}
    </Box>
  );
};
