/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Select,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  ListSubheader,
  MenuItem,
} from "@mui/material";
import { getAllDimensions } from "../service/service";
import { GroupedDimensions } from "../types";
// import { getAllDimensions } from "../service/service";
// import { Dimension, GroupedDimensions } from "../types";
// import { FixedSizeList } from "react-window";

interface LazyDimensionSelectProps {
  selectedDimensionIds: number[];
  setSelectedDimensionIds: React.Dispatch<React.SetStateAction<number[]>>;
  initialData?: any;
  mode?: "add" | "edit";
  disabled?: boolean;
}

const LazyDimensionSelect: React.FC<LazyDimensionSelectProps> = memo(
  ({
    selectedDimensionIds,
    setSelectedDimensionIds,
    initialData,
    mode,
    disabled,
  }) => {
    const [availableDimensions, setAvailableDimensions] = useState<
      GroupedDimensions[]
    >([]);

    useEffect(() => {
      const loadDimensions = async () => {
        alert("cargando")
        try {
          const raw = await getAllDimensions();
          const grouped = Object.entries(raw).map(([category, dims]) => ({
            category,
            dimensions: Array.isArray(dims) ? dims : [dims],
          }));
          setAvailableDimensions(grouped);
        } catch (error) {
          console.error("Error loading dimensions", error);
        }
      };

      loadDimensions();
    }, []);

    // const renderDimensionList = useCallback(
    //   ({ index, style }: { index: number; style: React.CSSProperties }) => {
    //     const group = availableDimensions[index];

    //     return (
    //       <div key={group.category} style={style}>
    //         <ListSubheader>{group.category}</ListSubheader>
    //         {group.dimensions.map((dim) => (
    //           <MenuItem
    //             key={dim.id_dimension}
    //             value={dim.id_dimension}
    //             style={{ paddingLeft: "32px" }}
    //           >
    //             <Checkbox
    //               checked={selectedDimensionIds.includes(dim.id_dimension)}
    //               disabled={disabled}
    //             />
    //             <ListItemText primary={`${dim.name} (${dim.initial})`} />
    //           </MenuItem>
    //         ))}
    //       </div>
    //     );
    //   },
    //   [availableDimensions, selectedDimensionIds, disabled]
    // );

    return (
      <Select
        multiple
        value={selectedDimensionIds}
        onChange={(e) => {
          const value = e.target.value as number[];
          setSelectedDimensionIds(value);
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((id) => {
              const d = availableDimensions
                .flatMap((g) => g.dimensions)
                .find((x) => x.id_dimension === id);
              return (
                <Chip
                  key={id}
                  label={d ? `${d.name} (${d.initial})` : id}
                  size="small"
                />
              );
            })}
          </Box>
        )}
        disabled={disabled}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
              width: 250,
            },
          },
        }}
      >
        {availableDimensions.map((group) => [
          <ListSubheader key={group.category}>{group.category}</ListSubheader>,
          ...group.dimensions.map((dim) => (
            <MenuItem key={dim.id_dimension} value={dim.id_dimension}>
              <Checkbox
                checked={selectedDimensionIds.includes(dim.id_dimension)}
                disabled={disabled}
              />
              <ListItemText primary={`${dim.name} (${dim.initial})`} />
            </MenuItem>
          )),
        ])}
      </Select>
    );
  }
);

export default LazyDimensionSelect;
