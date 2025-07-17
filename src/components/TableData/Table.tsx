/* eslint-disable @typescript-eslint/no-unused-vars */
// Table.tsx
// import * as React from "react";

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
  Tooltip,
} from "@mui/material";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";
import { useTable } from "../../hooks/useTable";
import { Dimension, GroupedDimensions, Person } from "../../types";
import { useRef, useState, useEffect } from "react";
import PersonForm from "../Forms/PersonForm";

import { FilterPanelToobar } from "./FilterPanelToolbar";
import { deleteMeasurements } from "../../service/service";
import { useNotify } from "../../hooks/useNotifications";
import { useConfirmDialog } from "../../hooks/useConfirmation";

const DIM_MIN_PX = 80; // umbral mínimo para mostrar nombre completo
const FIXED_CHECKBOX = 48;
const FIXED_NAME = 200;

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface TableProps {
  dimensions: GroupedDimensions[];
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
  const tableRef = useRef<HTMLTableElement>(null);
  const [useInitials, setUseInitials] = useState(false);

  useEffect(() => {
    if (!tableRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (let e of entries) {
        const totalW = e.contentRect.width;
        const avail = totalW - FIXED_CHECKBOX - FIXED_NAME;
        const perCol = avail / flatDimensions.length;
        setUseInitials(perCol < DIM_MIN_PX);
      }
    });
    ro.observe(tableRef.current);
    return () => ro.disconnect();
  }, [flatDimensions.length]);
  return (
    <Box
      sx={{
        // width: "100%",
        // ml: 1,
        // mt: 20,
        padding: 1,
        margin: "10px 25px",
        // backgroundColor: "#f8f9fa",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        height: "100vh",
      }}
    >
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
          // padding: "0px",
          borderRadius: "5px",
          // margin: "10px 40px",
          padding: "5px",
          margin: "0 20px",
          border: "1px solid #E5E7EB",
          // height:"100%"
        }}
        elevation={1}
      >
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table size={dense ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{
                    backgroundColor: "background.paper",
                    // position: "sticky",
                    // left: 0,
                    // zIndex: 4,
                  }}
                  align="center"
                ></TableCell>
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
                          borderLeft: "0.5px solid rgba(0,0,0,0.1)",
                          p: 2,
                          // backgroundColor: "rgba(0, 0, 0, 0.01)",
                          backgroundColor: "background.paper",
                          // position: "sticky",
                          // top: 0,
                          // zIndex: 3,
                        }}
                      >
                        {cat != "Peso" ? `${cat} (mm)` : `${cat} (kg)`}
                      </TableCell>
                    </>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: "background.paper",
                    width: FIXED_CHECKBOX,
                    minWidth: FIXED_CHECKBOX,
                    maxWidth: FIXED_CHECKBOX,
                    boxSizing: "border-box",
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    top: -1, // Ajusta según la altura de tu primera fila
                  }}
                >
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
                  sx={{
                    width: FIXED_NAME,
                    minWidth: FIXED_NAME,
                    maxWidth: FIXED_NAME,
                    boxSizing: "border-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    backgroundColor: "background.paper",
                    position: "sticky",
                    left: FIXED_CHECKBOX, // Para alinearlo después del checkbox
                    zIndex: 3,
                    top: -1, // Ajusta según la altura de tu primera fila
                  }}
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
                  // const col = idx + 1;
                  // const isBoundary = categoryBoundaries.has(col);
                  // const display = useInitials ? dim.initial : dim.name;
                  // const max = dim.name.length > 10 ? dim.initial : dim.name;
                  return (
                    <TableCell
                      key={dim.id_dimension}
                      align="right"
                      sortDirection={orderBy === dim.name ? order : false}
                      sx={{
                        borderLeft: "2px solid rgba(0,0,0,0.1)",
                        // backgroundColor: "rgba(0, 0, 0, 0.01)",
                        backgroundColor: "background.paper",
                        position: "sticky",
                        top: -1, // Ajusta según la altura de tu primera fila
                        zIndex: 3,
                        // }}
                      }}
                    >
                      <Tooltip title={dim.name} arrow>
                        <TableSortLabel
                          active={orderBy === dim.name}
                          direction={orderBy === dim.name ? order : "asc"}
                          onClick={(e) => handleRequestSort(e, dim.name!)}
                          sx={{
                            display: "block",

                            // overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dim.name}
                        </TableSortLabel>
                      </Tooltip>
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
                            borderLeft: "2px solid rgba(0,0,0,0.1)",
                            // borderRight: isBoundary
                            //   ? "2px solid rgba(0,0,0,0.3)"
                            //   : undefined,
                          }}
                        >
                          {(() => {
                            const value = person.dimensions && person.dimensions[dim.name as keyof typeof person.dimensions];
                            return typeof value === "string" || typeof value === "number"
                              ? value
                              : value != null
                              ? String(value)
                              : "";
                          })()}
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
