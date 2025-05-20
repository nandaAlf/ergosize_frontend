// src/hooks/useNotify.ts
import { useNotifications } from '@toolpad/core/useNotifications';

type Severity = 'success' | 'error' | 'info' | 'warning';

// interface NotifyOptions {
//   autoHideDuration?: 2000;
// }

export const useNotify = () => {
  const notifications = useNotifications();

  const notify = (severity: Severity) => 
    (message: string, ) =>
      notifications.show(message, { severity, autoHideDuration: 3000,});

  return {
    success: notify('success'),
    error: notify('error'),
    info: notify('info'),
    warning: notify('warning'),
  };
};
