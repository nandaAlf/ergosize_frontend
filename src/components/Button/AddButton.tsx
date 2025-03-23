import Tooltip from "@mui/material/Tooltip";

import IconButton from "@mui/material/IconButton";
import { ReactElement } from "react"; // Importar ReactElement para tipar el ícono

interface Button {
  title: string;
  onAction: () => void;
  icon: ReactElement; // Nueva propiedad para el ícono
}

export const ActionButton: React.FC<Button> = ({ title, onAction, icon }) => {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onAction}>
        {icon} {/* Renderizar el ícono pasado como prop */}
      </IconButton>
    </Tooltip>
  );
};