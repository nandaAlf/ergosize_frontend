
import { Routes, Route } from "react-router-dom";
import  Home  from "../pages/Home";
import Studies from "../pages/Studies";
import Tables from "../pages/Tables";
import TableDetail from "../pages/TableDetail";
import StudyDetail from "../pages/StudyDetail";
import Help from "../pages/Help";


export function AppRouter() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studies" element={<Studies />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/tables/:id" element={<TableDetail />} />
        <Route path="/studies/:id" element={<StudyDetail />} />
        <Route path="/help/" element={<Help/>} />
        </Routes>
    // {/* </Router> */}
  );
}