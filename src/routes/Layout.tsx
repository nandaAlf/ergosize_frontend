// Layout.tsx
import { useLocation } from "react-router-dom";
import Navbar from "../components/AppBar/AppBar"
import AppRouter from "./AppRouter";

export default function Layout() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/help";

  return (
    <>
      { !hideNavbar && <Navbar /> }
      <AppRouter />
    </>
  );
}
