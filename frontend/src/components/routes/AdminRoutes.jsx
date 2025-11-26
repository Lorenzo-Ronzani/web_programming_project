import { Route } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

// pages
import DashboardAdmin from "../pages/admin/dashboard/DashboardAdmin";
import ProgramList from "../pages/admin/programs/ProgramList";
import AddProgram from "../pages/admin/programs/AddProgram";
import EditProgram from "../pages/admin/programs/EditProgram";

import AdmissionsForm from "../pages/admin/admissions/AdmissionsForm";
import TuitionForm from "../pages/admin/tuition/TuitionForm";
import IntakesForm from "../pages/admin/intakes/IntakesForm";
import RequirementsForm from "../pages/admin/requirements/RequirementsForm";
import StructureForm from "../pages/admin/structure/StructureForm";

import CourseList from "../pages/admin/courses/CourseList";
import AddCourse from "../pages/admin/courses/AddCourse";
import EditCourse from "../pages/admin/courses/EditCourse";

import StudentList from "../pages/admin/students/StudentList";
import AddStudent from "../pages/admin/students/AddStudent";
import EditStudent from "../pages/admin/students/EditStudent";

import EnrollmentList from "../pages/admin/enrollments/EnrollmentList";
import AddEnrollment from "../pages/admin/enrollments/AddEnrollment";

export const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<DashboardAdmin />} />

    <Route path="programs" element={<ProgramList />} />
    <Route path="programs/add" element={<AddProgram />} />
    <Route path="programs/edit/:id" element={<EditProgram />} />

    <Route path="admissions" element={<AdmissionsForm />} />
    <Route path="tuition" element={<TuitionForm />} />
    <Route path="intakes" element={<IntakesForm />} />
    <Route path="requirements" element={<RequirementsForm />} />
    <Route path="structure" element={<StructureForm />} />

    <Route path="courses" element={<CourseList />} />
    <Route path="courses/add" element={<AddCourse />} />
    <Route path="courses/edit/:id" element={<EditCourse />} />

    <Route path="students" element={<StudentList />} />
    <Route path="students/add" element={<AddStudent />} />
    <Route path="students/edit/:id" element={<EditStudent />} />

    <Route path="enrollments" element={<EnrollmentList />} />
    <Route path="enrollments/add" element={<AddEnrollment />} />
  </Route>
);
