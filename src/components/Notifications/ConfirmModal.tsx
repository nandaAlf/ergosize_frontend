// src/components/ConfirmModal.tsx
import { Modal, Box, Button, Typography, Divider } from '@mui/material';
import React from 'react';  // ← Import React
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onAccept: () => void;
  onCancel: () => void;
  acceptLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  open,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  onAccept,
  onCancel,
  acceptLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6">{title}</Typography>
        <Divider/>
        <Typography id="modal-description" sx={{ my: 2 }}>{description}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} variant="outlined">{cancelLabel}</Button>
          <Button onClick={onAccept} variant="contained" >{acceptLabel}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
