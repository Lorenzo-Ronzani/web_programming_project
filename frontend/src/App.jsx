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
   ADMIN — PROGRAMS (NEW FILES)
   ================================================ */
import ProgramList from "./pages/admin/programs/ProgramList";
import AddProgram from "./pages/admin/programs/AddProgram";
import EditProgram from "./pages/admin/programs/EditProgram";

/* ================================================
   ADMIN — PROGRAMS SCTRUCTURE
   ================================================ */
import ProgramStructureList from "./pages/admin/structure/ProgramStructureList";
import AddProgramStructure from "./pages/admin/structure/AddProgramStructure";
import EditProgramStructure from "./pages/admin/structure/EditProgramStructure";

/* ================================================
   ADMIN — TUITIONS
   ================================================ */
import TuitionList from "./pages/admin/tuition/TuitionList";
import AddTuition from "./pages/admin/tuition/AddTuition";
import EditTuition from "./pages/admin/tuition/EditTuition";

/* ================================================
   ADMIN — REQUIREMENTS
   ================================================ */
import RequirementsList from "./pages/admin/requirements/RequirementsList";
import AddRequirement from "./pages/admin/requirements/AddRequirement";
import EditRequirement from "./pages/admin/requirements/EditRequirement";

/* ================================================
   ADMIN — ADMISSIONS (REAL FILES)
   ================================================ */
import AdmissionsList from "./pages/admin/admissions/AdmissionsList";
import AddAdmission from "./pages/admin/admissions/AddAdmission";
import EditAdmission from "./pages/admin/admissions/EditAdmission";

/* ================================================
   ADMIN — INTAKES (PUBLIC VERSIONS)
   ================================================ */
import PublicIntakesList from "./pages/admin/intakes/PublicIntakesList";
import AddPublicIntake from "./pages/admin/intakes/AddPublicIntake";
import EditPublicIntake from "./pages/admin/intakes/EditPublicIntake";



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

                {/* ADMIN — PROGRAMS */}
                <Route path="programs" element={<ProgramList />} />
                <Route path="programs/add" element={<AddProgram />} />
                <Route path="programs/edit/:id" element={<EditProgram />} />

                {/* ADMIN — PROGRAM STRUCTURE */}
                <Route path="structure" element={<ProgramStructureList />} />
                <Route path="structure/add" element={<AddProgramStructure />} />
                <Route path="structure/edit/:id" element={<EditProgramStructure />} />

                {/* ADMIN — REQUIEREMENTS */}
                <Route path="requirements" element={<RequirementsList />} />
                <Route path="requirements/add" element={<AddRequirement />} />
                <Route path="requirements/edit/:id" element={<EditRequirement />} />

                {/* ADMIN — TUITION */}
                <Route path="tuition" element={<TuitionList />} />
                <Route path="tuition/add" element={<AddTuition />} />
                <Route path="tuition/edit/:id" element={<EditTuition />} />

                {/* ADMIN — ADMISSIONS */}
                <Route path="admissions" element={<AdmissionsList />} />
                <Route path="admissions/add" element={<AddAdmission />} />
                <Route path="admissions/edit/:id" element={<EditAdmission />} />

                {/* ADMIN — INTAKES (PUBLIC) */}
                <Route path="intakes" element={<PublicIntakesList />} />
                <Route path="intakes/add" element={<AddPublicIntake />} />
                <Route path="intakes/edit/:id" element={<EditPublicIntake />} />

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
