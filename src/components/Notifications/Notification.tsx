import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type NotificationProps = {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'success' | 'error' | 'info' | 'warning'
  onClose: () => void;
  autoHideDuration?: number;
};

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
