// src/components/NavigationBar.tsx
import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  SvgIcon,
  Toolbar,
} from '@mui/material';

// SVG tal como lo tienes en tu HTML original
const CustomLogo: React.FC = () => (
  <SvgIcon
    viewBox="0 0 86 19"
    sx={{ width: 86, height: 19 }}
    inheritViewBox
  >
    <path
      fill="#B4C0D3"
      d="m.787 12.567 6.055-2.675 3.485 2.006.704 6.583-4.295-.035.634-4.577-.74-.422-3.625 2.817-2.218-3.697Z"
    />
    <path
      fill="#00D3AB"
      d="m10.714 11.616 5.352 3.908 2.112-3.767-4.295-1.725v-.845l4.295-1.76-2.112-3.732-5.352 3.908v4.013Z"
    />
    <path
      fill="#4876EF"
      d="m10.327 7.286.704-6.583-4.295.07.634 4.577-.74.422-3.66-2.816L.786 6.617l6.055 2.676 3.485-2.007Z"
    />
  </SvgIcon>
);

const menuItems = [
  'Estudios',
  'Mis Estudios',
  'Ayudas',
  'Opcciones',
] as const;
 
const Navbar: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        top: 0,
        marginLeft: "20px",
        marginRight: "20px",
        width: "calc(100% - 40px)",
        borderRadius: 5,
        // backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.05)',
        // zIndex: theme => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar variant="dense" disableGutters sx={{ gap: 4 }}>
          {/* Logo */}
          <Box sx={{ flexShrink: 0 }}>
            <CustomLogo />
          </Box>

          {/* Menú principal */}
          <Box sx={{ display: 'flex', flexGrow: 1, gap: 2 }}>
            {menuItems.map(item => (
              <Button
                key={item}
                variant="text"
                // color="info"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Sign in / Sign up */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" color="primary" size="small">
              Sign in
            </Button>
            <Button variant="contained" color="primary" size="small">
              Sign up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
