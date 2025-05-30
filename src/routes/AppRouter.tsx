import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Studies from "../pages/Studies";
import StudyDetail from "../pages/StudyDetail";
import HelpMenu from "../pages/Help";
import Tables from "../pages/Tables";
import TableDetail from "../pages/AnthropometricTable";
import Login from "../components/Forms/Login";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    // <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help/" element={<HelpMenu />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/studies"
        element={
          <ProtectedRoute >
            <Studies />
          </ProtectedRoute>
        }
      />
      {/* <Route> */}
      {/* <Route path="/studies" element={<Studies />} /> */}
      <Route path="/tables/:id" element={<Tables />} />
      {/* <Route
        path="/tables/:id"
        element={
          <ProtectedRoute>
            <Tables />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route path="/tables/:id" element={<TableDetail />} /> */}
      <Route path="/studies/:id" element={<StudyDetail />} />
    </Routes>
    // {/* </Router> */}
  );
}
