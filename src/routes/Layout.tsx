// Layout.tsx
import { useLocation } from "react-router-dom";
import AppRouter from "./AppRouter";
import DashboardLayoutBasic from "../components/D";

export default function Layout() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/help";

  return (
    <>
      { !hideNavbar &&  <DashboardLayoutBasic/> }
      <AppRouter />
    </>
  );
}
