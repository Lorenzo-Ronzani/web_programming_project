import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ✅ Pages
import Home from "./pages/Home";
import Programs from "./components/programs/Programs";
import ProgramsAll from "./pages/ProgramsAll";
import Courses from "./components/courses/Courses";
import CoursesAll from "./pages/CoursesAll";
import Terms from "./components/terms/Terms";
import DashboardUser from "./components/dashboards/DashboardUser";
import DashboardAdmin from "./components/dashboards/DashboardAdmin";
import CourseRegistration from "./components/courses/CourseRegistration";
import CourseEdit from "./components/courses/CourseEdit";

import MainContent from "./pages/MainContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ✅ ProtectedRoute
import ProtectedRoute from "./components/routes/ProtectedRoute";

/*
  App.jsx
  ------------------------
  - Provides global auth context
  - Public + protected routes
*/

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programsall" element={<ProgramsAll />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/coursesall" element={<CoursesAll />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/content" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/dashboarduser"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <DashboardUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coursesregistration"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <CourseRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboardadmin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courseedit/:code"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CourseEdit />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
