import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  FileText,
  DollarSign,
  Calendar,
  ListChecks,
  Boxes,
  BookOpen,
  UserRound,
  UserPlus,
} from "lucide-react";

/*
  SidebarAdmin
  -----------------------------------------------------
  - Modern, compact, professional
  - Icons for better navigation
  - Active state highlighting
  - Logical grouping of menu sections
*/

const SidebarAdmin = () => {
  const menuItemStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100";

  const activeStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-100 text-blue-700";

  return (
    <div className="w-full h-full pt-6 px-3 text-sm font-medium select-none">
      {/* TITLE */}
      <div className="px-4 pb-4 text-lg font-semibold text-gray-800">
        Admin Panel
      </div>

      {/* DASHBOARD */}
      <NavLink
        to="/dashboardadmin"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      {/* SECTION: PROGRAMS */}
      <div className="mt-6 mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
        Programs
      </div>

      <NavLink
        to="/admin/programs"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <Layers size={18} />
        List Programs
      </NavLink>

      <NavLink
        to="/admin/programs/add"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <Layers size={18} />
        Add Program
      </NavLink>

      {/* SECTION: PROGRAM DETAILS */}
      <div className="mt-6 mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
        Program Details
      </div>

      <NavLink
        to="/dashboardadmin/admissions"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <FileText size={18} />
        Admissions
      </NavLink>

      <NavLink
        to="/admin/tuition"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <DollarSign size={18} />
        Tuition
      </NavLink>

      <NavLink
        to="/admin/intakes"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <Calendar size={18} />
        Intakes
      </NavLink>

      <NavLink
        to="/admin/requirements"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <ListChecks size={18} />
        Requirements
      </NavLink>

      <NavLink
        to="/admin/structure"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <Boxes size={18} />
        Structure
      </NavLink>

      {/* SECTION: COURSES */}
      <div className="mt-6 mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
        Courses
      </div>

      <NavLink
        to="/admin/courses"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <BookOpen size={18} />
        List Courses
      </NavLink>

      <NavLink
        to="/admin/courses/add"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <BookOpen size={18} />
        Add Course
      </NavLink>

      {/* SECTION: STUDENTS */}
      <div className="mt-6 mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
        Students
      </div>

      <NavLink
        to="/admin/students"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <UserRound size={18} />
        List Students
      </NavLink>

      <NavLink
        to="/admin/students/add"
        className={({ isActive }) => (isActive ? activeStyle : menuItemStyle)}
      >
        <UserPlus size={18} />
        Add Student
      </NavLink>
    </div>
  );
};

export default SidebarAdmin;
