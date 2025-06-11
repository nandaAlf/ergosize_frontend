// ThemeContext.tsx
import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: 'light' as 'light' | 'dark',
});

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#3f51b5' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#f50057' : '#f48fb1',
      },
    },
  }), [mode]);

  const toggleTheme = () => {
    alert("aaaaa");
    setMode(prev => prev === 'light' ? 'dark' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};