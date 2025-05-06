
import { Routes, Route } from "react-router-dom";
import  Home  from "../pages/Home";
import Studies from "../pages/Studies";;
import StudyDetail from "../pages/StudyDetail";
import HelpMenu from "../pages/Help";
import Tables from "../pages/Tables";
import TableDetail from "../pages/AnthropometricTable";


export default function AppRouter() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studies" element={<Studies />} />
        <Route path="/tables/:id" element={<Tables />} />
        {/* <Route path="/tables/:id" element={<TableDetail />} /> */}
        <Route path="/studies/:id" element={<StudyDetail />} />
        <Route path="/help/" element={<HelpMenu/>} />
        </Routes>
    // {/* </Router> */}
  );
}