// MyTable.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  FormControlLabel,
  Switch,
  TablePagination,
} from "@mui/material";
import {
  deleteMeasurements,
  getData,
  insertMeasurements,
  insertPerson,
} from "../../api/api";
import TableHead from "../DataTable/MyTableHead";
import TableBody from "../DataTable/MyTableBody";
import useTable from "../../hooks/useTable2";
import TableToolbar from "./TableToolbar";
import PersonForm from "../Forms/PersonForm2";
import { Dimension, Person } from "../../types";
// import { HeadCell, Person, ApiResponse } from './types';
interface HeadCell {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}


type Dimensions = Dimension[];

interface MyTableProps {
  dim: string[]; // Lista de todas las dimensiones
  persons: Person[]; // Lista de personas con sus mediciones
}

const MyTable2: React.FC<MyTableProps> = ({ dim, persons }) => {
  const [rows, setRows] = useState<Person[]>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [openPersonForm, setOpenPersonForm] = useState(false); // Estado para controlar el diálogo
  const [editPerson, setEditPerson] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null >(null);
  const [dimensionsMap, setDimensionsMap] = useState<Record<string, number>>(
    {}
  ); // Mapa de dimensiones
  const getHeadCells = (dimensions: string[]): HeadCell[] => {
    const dimensionColumns: HeadCell[] = dimensions.map((dimension) => ({
      id: dimension,
      numeric: true,
      disablePadding: false,
      label: dimension,
    }));

    const fixedColumns: HeadCell[] = [
      {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Nombre",
      },
    ];

    return [...fixedColumns, ...dimensionColumns];
  };
  const {
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
  } = useTable(rows);

  useEffect(() => {
   
    const fetchDimensions = async () => {
      try {
        const dimensions: Dimensions = await getData("/dimension"); // Especificar el tipo
        const map: Record<string, number> = {};
        dimensions.forEach((dimension) => {
          map[dimension.name] = dimension.id;
        });
        setDimensionsMap(map);
      } catch (error) {
        console.error("Error al obtener las dimensiones:", error);
      }
    };

    fetchDimensions();
  }, []);

  useEffect(() => {
    setRows(persons);
    setDimensions(dim);
    console.log("Dimensiones actualizadas:", dim);
    console.log("Filas actualizadas:", persons);
    console.log("jajaja");
  }, [dim, persons]); // Este efecto se ejecutará cuando dimensions o rows cambien

  const headCells = getHeadCells(dimensions);

  // Función para manejar la adición de una nueva persona
  const handleAddPerson = () => {
    setOpenPersonForm(true); // Abrir el diálogo
  };
  const handleEditPerson = () => {
    // setEditPerson(true); // Abrir el diálogo
    if (selected.length === 1) { // Solo permitir editar si hay una fila seleccionada
      const personToEdit = rows.find((row) => row.id === selected[0]);
      if (personToEdit) {
        setSelectedPerson(personToEdit); // Guardar la persona seleccionada
        setEditPerson(true); // Abrir el diálogo en modo edición
      }
    } else {
      alert("Selecciona una sola fila para editar.");
    }
  };
  const handleDeletePerson = async () => {
    console.log(persons)
    try {
      console.log('VER')
      console.log(selected)
      const studyId = 1; // ID del estudio
      // const personId = 2; // ID de la persona
      const result = await deleteMeasurements(studyId, selected[0]);
      console.log("Mediciones eliminadas:", result);
    } catch (error) {
      console.error("Error al eliminar las mediciones:", error);
    }
  };

  // Función para cerrar el diálogo
  const handleClosePersonForm = () => {
    setOpenPersonForm(false);
    setEditPerson(false);
  };

  const handleSave = async (
    person: {
      name: string;
      gender: string | null;
      date_of_birth: string | null;
      country: string;
      state: string;
      province: string;
    },
    measurements: {
      value: number | null;
      position: string | null;
      study: number | null;
      dimension: string | null;
    }[]
  ) => {
    try {
  
      // 1. Insertar la persona en la base de datos
      const personResponse = await insertPerson(person);
      const personId = personResponse.id; // Obtener el ID de la persona creada

      // 2. Insertar las mediciones asociadas a la persona
      const measurementsWithIds = measurements.map((measurement) => ({
        ...measurement,
        person: personId,
        dimension: dimensionsMap[measurement.dimension || ""], // Usar el ID de la dimensión
      }));

      await insertMeasurements(measurementsWithIds);
      // Cerrar el diálogo
      // handleCloseDialog();

      // Mostrar un mensaje de éxito o actualizar la tabla
      console.log("Persona y mediciones guardadas correctamente");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar
          numSelected={selected.length}
          onAddPerson={handleAddPerson}
          onDeletePerson={handleDeletePerson}
          onEditPerson={handleEditPerson}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"}>
            <TableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody
              visibleRows={visibleRows}
              selected={selected}
              dimensions={dimensions}
              handleClick={handleClick}
            />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={(event) => setDense(event.target.checked)}
          />
        }
        label="Dense padding"
      />

      {/* Diálogo para añadir una nueva persona */}
      <PersonForm
        mode={editPerson? "edit":"add"}
        open={openPersonForm || editPerson}
        onClose={handleClosePersonForm}
        onSave={handleSave}
        dimensions={dimensions}
        studyId={1}
        // personData={rows[0]}
        // personData={editPerson ? selectedPerson : undefined} // Pasar los datos de la persona en modo edición
        // personData={editPerson && selectedPerson ? selectedPerson : undefined} // Pasar solo si selectedPerson no es null o undefined
        personData={
          editPerson && selectedPerson
            ? selectedPerson
            : {
                id: -1, // Default ID for "add" mode
                name: "", // Default name for "add" mode
                dimensions: {}, // Default empty dimensions for "add" mode
              }
        }
      />
    </Box>
  );
};

export default MyTable2;
