/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  BrowserRouter,
  useNavigate,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";

import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";

import AppRouter from "../routes/AppRouter";
import HelpMenu from "../pages/Help";
import { DialogsProvider } from "@toolpad/core/useDialogs";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  AppProvider,
  type Session,
  type Navigation,
} from "@toolpad/core/AppProvider";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { parseJwt } from "../hooks/parseJwt";
import ApiService from "../api/ApiService";

const NAVIGATION: Navigation = [
  { kind: "header", title: "Main items" },
  {
    kind: "page",
    segment: "dashboard",
    title: "Home",
    icon: <DashboardIcon />,
  },
  {
    kind: "page",
    segment: "studies",
    title: "Estudios",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "page",
    segment: "help",
    title: "Ayudas",
    icon: <ShoppingCartIcon />,
  },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    kind: "page",
    segment: "account",
    title: "Cuenta",
    icon: <BarChartIcon />,
    children: [
      {
        kind: "page",
        segment: "change-password",
        title: "Cambiar contraseña",
        icon: <DescriptionIcon />,
      },
      {
        kind: "page",
        segment: "reports/traffic",
        title: "Ver cuenta",
        icon: <DescriptionIcon />,
      },
    ],
  },
  // {
  //   kind: "page",
  //   segment: "ad",
  //   title: "Opciones",
  //   icon: <LayersIcon />,
  // },
];
// 2. Adapter to sync ToolpadCore router with React Router
function useReactRouterAdapter() {
  const navigate = useNavigate();
  const location = useLocation();

  // Provide the minimal router interface required by ToolpadCore
  return React.useMemo(
    () => ({
      // current full path
      pathname: location.pathname + location.search,

      // search parameters as URLSearchParams
      searchParams: new URLSearchParams(location.search),
      // navigate function
      navigate: (path: string | URL) =>
        navigate(typeof path === "string" ? path : path.toString()),
      // subscribe callback (ToolpadCore may not use it heavily)
      //   subscribe: (listener: () => void) => {
      //     // React Router doesn't expose subscribe; no-op
      //     return () => undefined;
      //   },
      // force reload
      reload: () => window.location.reload(),
    }),
    [location.pathname, location.search, navigate]
  );
}
function LayoutSwitcher() {
  const location = useLocation();

  // Do not render dashboard sidebar for /help
  if (location.pathname.startsWith("/help")) {
    return <AppRouter />;
  }

  return (
    <DashboardLayout>
      <AppRouter />
    </DashboardLayout>
  );
}
export default function DashboardLayoutBasic() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = React.useState<Session | null>(null);

  // 2. Al montar, intenta “recuperar” la sesión del localStorage
  React.useEffect(() => {
    async function getUser() {
      try {
        const { data: me } = await ApiService.get("accounts/users/me/");
        // setSession({ user: me.user});
        setSession({
          user: {
            // Por ejemplo, construimos el nombre completo:
            name:
              `${me.first_name || ""} ${me.last_name || ""}`.trim() ||
              me.username,
            email: me.email,
            // Si en tu modelo tienes un campo 'avatar', úsalo; si no, genera uno:
            image:
              me.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                me.first_name || me.username
              )}&background=0D8ABC&color=fff`,
          },
        });
      } catch {
        // token inválido: fuerza logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setSession(null);
      }
    }
    getUser();
  }, []);

  const authentication = React.useMemo(
    () => ({
      signIn: (userData: Session["user"]) => {
        setSession({ user: userData });
      },
      signOut: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setSession(null);
        navigate("/login");
      },
    }),
    [navigate]
  );

  // Estado para el menú del avatar
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  // Componente que renderiza en la toolbar
  // const CustomUserMenu: React.FC = () => {
  //   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //   const open = Boolean(anchorEl);
  //   const handleClick = (e: React.MouseEvent<HTMLElement>) =>
  //     setAnchorEl(e.currentTarget);
  //   const handleClose = () => setAnchorEl(null);

  //   if (!session) return null;

  //   return (
  //     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //       <Typography variant="body2">{session.user.name}</Typography>
  //       <IconButton onClick={handleClick} size="small">
  //         <Avatar src={session.user.image} alt={session.user.name} />
  //       </IconButton>
  //       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  //         <MenuItem
  //           onClick={() => {
  //             handleClose();
  //             navigate("/change-password");
  //           }}
  //         >
  //           Cambiar contraseña
  //         </MenuItem>
  //         <MenuItem
  //           onClick={() => {
  //             handleClose();
  //             authentication.signOut();
  //           }}
  //         >
  //           Cerrar sesión
  //         </MenuItem>
  //       </Menu>
  //     </Box>
  //   );
  // };
  return (
    <Box position="relative">
      <AppProvider
        session={session}
        authentication={authentication}
        navigation={NAVIGATION}
        router={useReactRouterAdapter()}
        branding={{
          logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
          title: "ERGOsizes",
          homeUrl: "/",
        }}
      >
        {/* <Box sx={{ position: "absolute", top: 8, right: 79, zIndex: 1901 }}>
          <CustomUserMenu />
        </Box> */}
        {/* <DialogsProvider> */}
        {/* Render the custom user menu above or below the layout as needed */}
        <LayoutSwitcher />
        {/* </DialogsProvider> */}
      </AppProvider>
    </Box>
  );
}
