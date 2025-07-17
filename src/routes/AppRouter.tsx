import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Studies from "../pages/Studies";
import StudyDetail from "../pages/StudyDetail";
import HelpMenu from "../pages/Help";
// import Tables from "../pages/Tables";
import Login from "../components/Forms/Login";
import ProtectedRoute from "./ProtectedRoute";
import ChangePasswordPage from "../components/Forms/ChangePassword";
import ForgotPassword from "../components/Forms/ForgotPassword";
import ResetPassword from "../components/Forms/ResetPassword";
import Tables from "../pages/Tables";
// import StudyGallery from "../pages/StudyGallery";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help/" element={<HelpMenu />} />
      <Route path="/auth" element={<Login />} />
      <Route
        path="/studies"
        element={
          <ProtectedRoute>
            <Studies />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/reference_tables/" element={<StudyGallery />} /> */}
      <Route path="/tables/:id" element={<Tables />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="account/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route path="/studies/:id" element={<StudyDetail />} />
    </Routes>
  );
}
