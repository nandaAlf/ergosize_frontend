import * as React from "react";
import {
  BrowserRouter,
  useNavigate,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import type { Navigation } from "@toolpad/core/AppProvider";
import AppRouter from "../routes/AppRouter";
import HelpMenu from "../pages/Help";

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
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        kind: "page",
        segment: "reports/sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        kind: "page",
        segment: "reports/traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    kind: "page",
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
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

  return (
    <>
      <AppProvider
        navigation={NAVIGATION}
        router={useReactRouterAdapter()}
        branding={{
          logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
          title: "ERGOsizes",
          homeUrl: "/",
        }}
        
      >
        <LayoutSwitcher />
      </AppProvider>
    </>
  );
}
