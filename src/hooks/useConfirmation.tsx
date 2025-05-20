// src/hooks/useConfirmDialog.tsx
import React from 'react';
import ConfirmModal from '../components/Notifications/ConfirmModal';
import type { ConfirmModalProps } from '../components/Notifications/ConfirmModal';

type ConfirmOptions = Omit<ConfirmModalProps, 'open' | 'onAccept' | 'onCancel'>;

export function useConfirmDialog() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmOptions>({});
  const resolverRef = React.useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions = {}) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleClose = () => {
    setOpen(false);
    // Limpiar después de un pequeño delay para evitar race conditions
    setTimeout(() => {
      resolverRef.current = null;
    }, 100);
  };

  const handleAccept = () => {
    resolverRef.current?.(true);
    handleClose();
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    handleClose();
  };

  const dialog: React.ReactNode = (
    <ConfirmModal
      open={open}
      onAccept={handleAccept}
      onCancel={handleCancel}
      {...options}
    />
  );

  return { confirm, dialog };
}