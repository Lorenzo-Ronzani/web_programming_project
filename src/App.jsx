import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ✅ Layout Components
import TopBar from "./components/topbar/TopBar";
import Footer from "./components/footer/Footer";

// ✅ Public Pages
import Home from "./pages/Home";
import Programs from "./components/programs/Programs";
import ProgramsAll from "./pages/ProgramsAll";
import Courses from "./components/courses/Courses";
import CoursesAll from "./pages/CoursesAll";
import Terms from "./components/terms/Terms";
import MainContent from "./pages/MainContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ✅ Protected Pages (Dashboards)
import DashboardUser from "./components/dashboards/DashboardUser";
import DashboardAdmin from "./components/dashboards/DashboardAdmin";

// ✅ User Management (Admin only)
import ManageUsers from "./components/users/ManageUsers";
import UserForm from "./components/users/UserForm";
import Settings from "./components/users/Settings";

// ✅ Courses Management
import CourseRegistration from "./components/courses/CourseRegistration";
import CourseEdit from "./components/courses/CourseEdit";

// ✅ Protected Route Wrapper
import ProtectedRoute from "./components/routes/ProtectedRoute";

/*
  App.jsx
  ------------------------
  - Wraps all routes with AuthProvider
  - Defines public and protected routes
  - Supports role-based access (student/admin)
  - Includes global layout (TopBar + Footer)
*/

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">

          {/* Main content area */}
          <main className="flex-1">
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

              {/* 👩‍🎓 Student Routes */}
              <Route
                path="/dashboarduser"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <DashboardUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coursesregistration"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <CourseRegistration />
                  </ProtectedRoute>
                }
              />

              {/* 🧑‍💼 Admin Routes */}
              <Route
                path="/dashboardadmin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manageusers"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/useradd"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/useredit/:id"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserForm />
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
              <Route
                path="/courseadd"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <CourseEdit />
                  </ProtectedRoute>
                }
              />

              {/* ⚙️ Shared Settings (Admin + Student) */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin", "student"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* 🚫 Fallback: Redirect unknown paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
