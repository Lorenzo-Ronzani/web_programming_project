import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

/* ================================================
   PUBLIC PAGES
   ================================================ */
import Home from "./pages/Home";
import Programs from "./components/programs/Programs";
import ProgramsAll from "./pages/ProgramsAll";
import Courses from "./components/courses/Courses";
import CoursesAll from "./pages/CoursesAll";
import Terms from "./components/terms/Terms";
import MainContent from "./pages/MainContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/* ================================================
   STUDENT AREA
   ================================================ */
import DashboardUser from "./components/dashboards/DashboardUser";
import CourseRegistration from "./components/courses/CourseRegistration";

/* ================================================
   ADMIN LAYOUT + DASHBOARD
   ================================================ */
import AdminLayout from "./components/admin/AdminLayout";
import DashboardAdmin from "./components/dashboards/DashboardAdmin";

/* ================================================
   ADMIN – USER & COURSE MANAGEMENT
   ================================================ */
import ManageUsers from "./components/users/ManageUsers";
import UserForm from "./components/users/UserForm";
import CourseEdit from "./components/courses/CourseEdit";

/* ================================================
   SHARED SETTINGS
   ================================================ */
import Settings from "./components/users/Settings";

/* ================================================
   AUTH ROUTE PROTECTION
   ================================================ */
import ProtectedRoute from "./components/routes/ProtectedRoute";

/* ================================================
   ADMIN — ADMISSIONS (REAL FILES)
   ================================================ */
import AdmissionsList from "./pages/admin/admissions/AdmissionsList";
import AddAdmission from "./pages/admin/admissions/AddAdmission";

/*
  App.jsx
  ---------------------------------------------------------------
  Handles:
  ✔ Public routes
  ✔ Student dashboard routes
  ✔ Admin dashboard routes
  ✔ Nested admin layout (/dashboardadmin/*)
  ✔ Role-based access control via ProtectedRoute
  ✔ Clean and scalable structure
*/

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>

              {/* ========================================
                 PUBLIC ROUTES
                 ======================================== */}
              <Route path="/" element={<Home />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programsall" element={<ProgramsAll />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/coursesall" element={<CoursesAll />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/content" element={<MainContent />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ========================================
                 STUDENT ROUTES
                 ======================================== */}
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

              {/* ========================================
                 ADMIN AREA (NESTED)
                 ======================================== */}
              <Route
                path="/dashboardadmin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* Default admin dashboard */}
                <Route index element={<DashboardAdmin />} />

                {/* ADMIN — PROGRAM DETAILS: ADMISSIONS */}
                <Route path="admissions" element={<AdmissionsList />} />
                <Route path="admissions/add" element={<AddAdmission />} />
                <Route path="admissions/edit/:id" element={<AddAdmission />} />
              </Route>

              {/* ========================================
                 LEGACY ADMIN ROUTES (still active)
                 ======================================== */}
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

              {/* ========================================
                 SHARED SETTINGS
                 ======================================== */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin", "student"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* ========================================
                 FALLBACK / UNKNOWN ROUTES
                 ======================================== */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
