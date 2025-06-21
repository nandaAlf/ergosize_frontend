/* eslint-disable @typescript-eslint/no-unused-vars */
// // src/components/NavigationBar.tsx
// import React from "react";
// import {
//   AppBar,
//   Box,
//   Button,
//   Container,
//   SvgIcon,
//   Toolbar,
// } from "@mui/material";
// import pagesRoutes from "../../routes/routes";
// import { Link } from "react-router-dom";

// // SVG tal como lo tienes en tu HTML original
// const CustomLogo: React.FC = () => (
//   <SvgIcon viewBox="0 0 86 19" sx={{ width: 86, height: 19 }} inheritViewBox>
//     <path
//       fill="#B4C0D3"
//       d="m.787 12.567 6.055-2.675 3.485 2.006.704 6.583-4.295-.035.634-4.577-.74-.422-3.625 2.817-2.218-3.697Z"
//     />
//     <path
//       fill="#00D3AB"
//       d="m10.714 11.616 5.352 3.908 2.112-3.767-4.295-1.725v-.845l4.295-1.76-2.112-3.732-5.352 3.908v4.013Z"
//     />
//     <path
//       fill="#4876EF"
//       d="m10.327 7.286.704-6.583-4.295.07.634 4.577-.74.422-3.66-2.816L.786 6.617l6.055 2.676 3.485-2.007Z"
//     />
//   </SvgIcon>
// );

// const menuItems = ["Estudios", "Mis Estudios", "Ayudas", "Opcciones"] as const;

// const Navbar: React.FC = () => {
//   return (
//     <AppBar
//       position="sticky"
//       color="transparent"
//       elevation={1}
//       sx={{
//         top: 0,
//         // marginLeft: "20px",
//         // marginRight: "20px",
//         // width: "calc(100% - 40px)",
//         // borderRadius: 5,

//         // backgroundColor: 'rgba(37, 100, 235, 0.02)',

//         // backgroundColor: '#fff',
//         //
//         // backdropFilter: 'blur(10px)',
//         // border: '1px solid rgba(0,0,0,0.05)',
//         // border: " 1px solid rgba(0, 0, 0, 0.12)",
//         // zIndex: theme => theme.zIndex.drawer + 1,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Toolbar variant="dense" disableGutters sx={{ gap: 4 }}>
//           {/* Logo */}
//           <Box sx={{ flexShrink: 0 }}>
//             <CustomLogo />
//           </Box>

//           {/* Menú principal */}
//           <Box sx={{ display: "flex", flexGrow: 1, gap: 2 }}>
//             {menuItems.map((item) => (
//               <Button
//                 key={item}
//                 variant="text"
//                 color="contrastText"
//                 sx={{ textTransform: "none", fontWeight: 500 }}
//                 component={Link}
//                 to={pagesRoutes[item]}
//               >
//                 {item}
//               </Button>
//             ))}
//           </Box>

//           {/* Sign in / Sign up */}
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Button variant="text" color="primary" size="small">
//               Sign in
//             </Button>
//             <Button variant="contained" color="primary" size="small">
//               Sign up
//             </Button>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

// export default Navbar;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   IconButton,
//   Avatar,
//   Menu,
//   MenuItem,
//   useTheme,
//   Theme,
//   PaletteMode,
//   Switch,
//   FormControlLabel,
//   Badge,
//   Container,
// } from "@mui/material";
// import {
//   Brightness4,
//   Brightness7,
//   Menu as MenuIcon,
//   Dashboard,
//   Help,
//   People,
//   Notifications,
//   Settings,
//   ExitToApp,
// } from "@mui/icons-material";

// interface NavBarProps {
//   mode: PaletteMode;
//   toggleTheme: () => void;
// }

// const NavBar: React.FC<NavBarProps> = ({ mode, toggleTheme }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);
//   const theme = useTheme();
//   const navigate = useNavigate();

//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileAnchorEl);

//   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setMobileAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMobileAnchorEl(null);
//   };

//   const handleNavigation = (path: string) => {
//     navigate(path);
//     handleMenuClose();
//   };

//   const menuItems = [
//     { label: "Inicio", path: "/", icon: <Dashboard /> },
//     { label: "Estudios", path: "/studies", icon: <People /> },
//     { label: "Ayudas Antropométricas", path: "/tools", icon: <Help /> },
//   ];

//   const userMenuItems = [
//     { label: "Notificaciones", icon: <Notifications />, action: () => {} },
//     { label: "Configuración", icon: <Settings />, action: () => handleNavigation("/settings") },
//     { label: "Cerrar Sesión", icon: <ExitToApp />, action: () => handleNavigation("/logout") },
//   ];

//   const renderDesktopMenu = (
//     <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", ml: 4 }}>
//       {menuItems.map((item) => (
//         <Button
//           key={item.path}
//           color="inherit"
//           onClick={() => handleNavigation(item.path)}
//           sx={{
//             mx: 1,
//             fontWeight: 500,
//             "&:hover": {
//               background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             },
//           }}
//         >
//           {item.label}
//         </Button>
//       ))}
//     </Box>
//   );

//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileAnchorEl}
//       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMobileMenuOpen}
//       onClose={handleMenuClose}
//       sx={{ display: { xs: "block", md: "none" } }}
//     >
//       {menuItems.map((item) => (
//         <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {item.icon}
//             <Typography variant="body1" sx={{ ml: 1 }}>
//               {item.label}
//             </Typography>
//           </Box>
//         </MenuItem>
//       ))}
//     </Menu>
//   );

//   const renderUserMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           John Doe
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           john.doe@ergosizes.com
//         </Typography>
//       </Box>

//       {userMenuItems.map((item, index) => (
//         <MenuItem key={index} onClick={item.action}>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {item.icon}
//             <Typography variant="body1" sx={{ ml: 1.5 }}>
//               {item.label}
//             </Typography>
//           </Box>
//         </MenuItem>
//       ))}
//     </Menu>
//   );

//   return (
//     <AppBar
//       position="static"
//       sx={{
//         background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//         boxShadow: theme.shadows[4],
//         color: theme.palette.common.white,
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           {/* Logo y nombre de la aplicación */}
//           <Typography
//             variant="h5"
//             noWrap
//             onClick={() => navigate("/")}
//             sx={{
//               mr: 2,
//               fontWeight: 800,
//               letterSpacing: ".1rem",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               component="img"
//               src="/logo.png" // Reemplazar con tu ruta de logo
//               alt="Ergosizes Logo"
//               sx={{ height: 40, mr: 1 }}
//             />
//             Ergosizes
//           </Typography>

//           {/* Menú móvil */}
//           <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//             <IconButton
//               size="large"
//               color="inherit"
//               onClick={handleMobileMenuOpen}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>

//           {/* Menú escritorio */}
//           <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//             {renderDesktopMenu}
//           </Box>

//           {/* Controles de la derecha */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {/* Cambio de tema */}
//             <IconButton
//               onClick={toggleTheme}
//               color="inherit"
//               sx={{ mr: 1 }}
//             >
//               {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
//             </IconButton>

//             {/* Avatar y menú de usuario */}
//             <IconButton
//               edge="end"
//               onClick={handleProfileMenuOpen}
//               color="inherit"
//             >
//               <Badge badgeContent={3} color="secondary">
//                 <Avatar
//                   alt="User Avatar"
//                   src="/avatar.jpg" // Reemplazar con la ruta del avatar del usuario
//                   sx={{
//                     bgcolor: theme.palette.secondary.main,
//                     width: 36,
//                     height: 36,
//                   }}
//                 />
//               </Badge>
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </Container>

//       {/* Menús */}
//       {renderMobileMenu}
//       {renderUserMenu}
//     </AppBar>
//   );
// };

// export default NavBar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Theme,
  Switch,
  FormControlLabel,
  Badge,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Home,
  Dashboard,
  Help,
  Notifications,
  Settings,
  ExitToApp,
  Login,
  HowToReg,
  Science,
} from "@mui/icons-material";
import ApiService from "../../api/ApiService";
import { useAuth } from "../../context/AuthContext";

interface NavBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  institucion: string;
  profesion: string;
}

// Función para obtener las iniciales del usuario
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
};

const NavBar: React.FC<NavBarProps> = ({ darkMode, toggleDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  // const [user, setUser] = useState<User | null>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileAnchorEl);
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = localStorage.getItem("access_token");
  //     if (token) {
  //       try {
  //         const userData = await ApiService.get("accounts/users/me/");
  //         console.log("User data fetched successfully:", userData);
  //         setUser(userData.data);
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //         // Si hay un error al obtener los datos del usuario, limpiamos el token
  //         localStorage.removeItem("access_token");
  //         localStorage.removeItem("refresh_token");
  //       }
  //     }
  //     // setLoading(false);
  //   };

  //   fetchUser();
  // }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };
  const deleteToken = () => {
    logout();
    // localStorage.removeItem("access_token");
    // localStorage.removeItem("refresh_token");
    // setUser(null);
    handleNavigation("/");
  };

  const baseMenuItems = [
    { label: "Inicio", path: "/", icon: <Home /> },
    { label: "Ayudas Antropométricas", path: "/help", icon: <Help /> },
    { label: "Tablas Antropométricas", path: "/reference_tables", icon: <Help /> },
    { label: "Estudios", path: "/studies", icon: <Dashboard /> },
  ];
  // Item adicional para ciertos roles
  const myStudiesMenuItem = {
    label: "Mis Estudios",
    path: "/studies?mine=true",
    icon: <Science />,
  };

  // Función para obtener los items del menú según el rol
  const getMenuItems = () => {
    if (!user) return baseMenuItems;

    // Mostrar "Mis Estudios" solo a usuarios generales y admin
    if (user.role === "investigador" || user.role === "admin") {
      return [...baseMenuItems, myStudiesMenuItem];
    }

    return baseMenuItems;
  };
  const menuItems = getMenuItems();
  const userMenuItems = [
    // { label: "Notificaciones", icon: <Notifications />, action: () => {} },
    {
      label: "Cambiar contraseña",
      icon: <Settings />,
      action: () => handleNavigation("account/change-password"),
    },
    {
      label: "Cerrar Sesión",
      icon: <ExitToApp />,
      action: () => deleteToken(),
    },
  ];
  const authMenuItems = [
    {
      label: "Iniciar Sesión",
      icon: <Login />,
      action: () => handleNavigation("/auth?mode=login"),
    },
    {
      label: "Registrarse",
      icon: <HowToReg />,
      action: () => handleNavigation("/auth?mode=register"),
    },
  ];
  // Estilo para botones activos
  const activeButtonStyle = {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[2],
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: darkMode
          ? theme.palette.grey[900]
          : theme.palette.background.paper,
        color: darkMode
          ? theme.palette.common.white
          : theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo y nombre de la aplicación */}
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer", mr: 4 }}
            onClick={() => navigate("/")}
          >
            <Box
              component="div"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1.5,
                boxShadow: theme.shadows[2],
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: theme.palette.common.white }}
              >
                E
              </Typography>
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ergosizes
            </Typography>
          </Box>

          {/* Menú escritorio */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => handleNavigation(item.path)}
                startIcon={item.icon}
                sx={{
                  mx: 1,
                  fontWeight: 500,
                  borderRadius: "8px",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: theme.palette.common.white,
                  },
                  ...(window.location.pathname === item.path
                    ? activeButtonStyle
                    : {}),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Menú móvil */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Controles de la derecha */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Cambio de tema */}
            <IconButton
              onClick={toggleDarkMode}
              color="inherit"
              sx={{
                borderRadius: "50%",
                background: theme.palette.action.hover,
                p: 1.2,
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Avatar y menú de usuario o botones de autenticación */}
            {user ? (
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  ml: 1,
                  borderRadius: "50%",
                  background: theme.palette.action.hover,
                  p: 0.8,
                }}
              >
                {/* <Badge badgeContent={3} color="primary"> */}
                <Avatar
                  alt={`${user.first_name} ${user.last_name}`}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    width: 32,
                    height: 32,
                  }}
                >
                  {getInitials(user.first_name, user.last_name)}
                </Avatar>
                {/* </Badge> */}
              </IconButton>
            ) : (
              // <Box display="flex" alignItems="center">
              <Button
                color="inherit"
                onClick={() => handleNavigation("/auth?mode=login")}
                startIcon={<Login />}
                sx={{
                  mx: 1,
                  fontWeight: 500,
                  borderRadius: "8px",
                  display: { xs: "none", md: "flex" },
                }}
              >
                Iniciar Sesión
              </Button>

              // </Box>
            )}
          </Stack>
        </Toolbar>
      </Container>

      {/* Menú móvil desplegable */}
      <Menu
        anchorEl={mobileAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMenuClose}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              minWidth: 200,
              ...(window.location.pathname === item.path
                ? activeButtonStyle
                : {}),
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {item.icon}
              <Typography variant="body1" sx={{ ml: 1.5 }}>
                {item.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        {!user && (
          <Box>
            <Divider />
            {authMenuItems.map((item, index) => (
              <MenuItem key={`auth-${index}`} onClick={item.action}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography variant="body1" sx={{ ml: 1.5 }}>
                    {item.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {user ? (
          <Box>
            <Box
              sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {`${user.first_name} ${user.last_name}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.email}
              </Typography>
            </Box>

            {userMenuItems.map((item, index) => (
              <MenuItem key={index} onClick={item.action}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography variant="body1" sx={{ ml: 1.5 }}>
                    {item.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        ) : (
          <Box>
            <Box
              sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                No has iniciado sesión
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Inicia sesión para acceder a todas las funciones
              </Typography>
            </Box>

            {authMenuItems.map((item, index) => (
              <MenuItem key={`auth-${index}`} onClick={item.action}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography variant="body1" sx={{ ml: 1.5 }}>
                    {item.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </AppBar>
  );
};

export default NavBar;
