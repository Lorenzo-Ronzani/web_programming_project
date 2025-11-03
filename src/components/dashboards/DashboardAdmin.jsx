import React, { useState } from 'react';
import TopBar from '../topbar/TopBar';
import Footer from '../footer/Footer';
import usersData from '../../data/users.json';
import coursesData from '../../data/courses.json';
import coursesUsers from '../../data/courses_users.json';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/*
  DashboardAdmin
  -------------------------
  - Displays admin overview with key statistics
  - Manages students, courses, and enrollments (mock JSON data)
  - Adds interactive status toggle for courses
*/

const DashboardAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local state for dynamic updates (mock simulation)
  const [users, setUsers] = useState(usersData);
  const [courses, setCourses] = useState(coursesData);

  // --- Quick stats
  const totalStudents = users?.filter((u) => u.role === 'student' && u.status === 'active').length || 0;
  const totalCourses = courses?.length || 0;
  const totalEnrollments = coursesUsers?.reduce((acc, s) => acc + (s.courses?.length || 0), 0) || 0;

  // --- Average progress
  const avgProgress =
    coursesUsers?.length > 0
      ? Math.round(
          coursesUsers.reduce((acc, s) => {
            if (!s.courses || s.courses.length === 0) return acc;
            const total = s.courses.reduce((sum, c) => sum + (c.progress || 0), 0);
            return acc + total / s.courses.length;
          }, 0) / coursesUsers.length
        )
      : 0;

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className='container mx-auto flex-1 px-6 py-8'>
        {/* Welcome message */}
        <div className='mb-8 rounded-2xl bg-white p-6 shadow-md'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Welcome, {user?.firstName || 'Admin'} {user?.lastName || ''}
          </h2>
          <p className='mt-1 text-gray-500'>Manage students, courses, and enrollment data.</p>
        </div>

        {/* Overview cards */}
        <h3 className='mb-4 text-lg font-semibold text-gray-800'>Overview</h3>
        <div className='mb-10 grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card label='Total Students' value={totalStudents} sub='Active' />
          <Card label='Courses Offered' value={totalCourses} sub='This term' />
          <Card label='Enrollments' value={totalEnrollments} sub='Total records' />
          <Card label='Avg Progress' value={`${avgProgress}%`} sub='Across all students' />
        </div>

        {/* Data tables section */}
        <CoursesTable courses={courses} setCourses={setCourses} navigate={navigate} />
        <div className='mt-6'>
          <StudentsTable students={users} coursesUsers={coursesUsers} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* Card Component */
const Card = ({ label, value, sub }) => (
  <div className='rounded-xl border border-gray-100 bg-white p-5 shadow-sm'>
    <h4 className='text-2xl font-bold text-gray-800'>{value}</h4>
    <p className='text-sm text-gray-500'>{label}</p>
    <p className='mt-1 text-xs text-gray-400'>{sub}</p>
  </div>
);

/* Students Table */
const StudentsTable = ({ students, coursesUsers }) => {
  const filteredStudents = (students || []).filter((s) => s.role === 'student');

  return (
    <div className='rounded-xl bg-white p-6 shadow-md'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800'>Students Overview</h3>
      <table className='w-full border-collapse text-left'>
        <thead>
          <tr className='border-b'>
            <th className='px-3 py-2 text-gray-600'>Student ID</th>
            <th className='px-3 py-2 text-gray-600'>Name</th>
            <th className='px-3 py-2 text-gray-600'>Email</th>
            <th className='px-3 py-2 text-gray-600'>Status</th>
            <th className='px-3 py-2 text-gray-600'>Courses</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => {
            const enrollment = (coursesUsers || []).find((s) => s.student_id === student.student_id);
            return (
              <tr key={student.student_id} className='border-b transition hover:bg-gray-50'>
                <td className='px-3 py-2 text-sm text-gray-700'>{student.student_id}</td>
                <td className='px-3 py-2 text-sm text-gray-700'>
                  {student.firstName} {student.lastName}
                </td>
                <td className='px-3 py-2 text-sm text-gray-700'>{student.email}</td>
                <td className='px-3 py-2 text-sm'>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium transition ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{student.status === 'active' ? 'Active' : 'Inactive'}</span>
                </td>
                <td className='px-3 py-2 text-sm text-gray-700'>{enrollment?.courses?.length || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* Courses Table */
const CoursesTable = ({ courses, setCourses, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  //  Toggle status dynamically
  const handleToggleStatus = (code) => {
    const updated = courses.map((course) =>
      course.code === code
        ? {
            ...course,
            status: course.status === 'active' ? 'inactive' : 'active'
          }
        : course
    );
    setCourses(updated);
  };

  // Filter courses
  const filteredCourses = (courses || []).filter((course) => {
    const q = searchTerm.toLowerCase();
    return course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
  });

  // Navigate to edit / add course
  const handleEdit = (course) => navigate(`/courseedit/${course.code}`);
  const handleAddCourse = () => navigate('/courseadd');

  return (
    <div className='rounded-xl bg-white p-6 shadow-md'>
      {/* Header section */}
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h3 className='text-lg font-semibold text-gray-800'>Courses List</h3>

        <div className='flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row'>
          <input type='text' placeholder='Search by code or title...' className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleAddCourse} className='rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700'>
            + Add Course
          </button>
        </div>
      </div>

      {/* Table */}
      <table className='w-full border-collapse text-left'>
        <thead>
          <tr className='border-b'>
            <th className='px-3 py-2 text-gray-600'>Code</th>
            <th className='px-3 py-2 text-gray-600'>Title</th>
            <th className='px-3 py-2 text-gray-600'>Instructor</th>
            <th className='px-3 py-2 text-gray-600'>Credits</th>
            <th className='px-3 py-2 text-gray-600'>Status</th>
            <th className='px-3 py-2 text-right text-gray-600'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr key={course.code} className='border-b transition hover:bg-gray-50'>
              <td className='px-3 py-2 text-sm text-gray-700'>{course.code}</td>
              <td className='px-3 py-2 text-sm text-gray-700'>{course.title}</td>
              <td className='px-3 py-2 text-sm text-gray-700'>{course.instructor}</td>
              <td className='px-3 py-2 text-sm text-gray-700'>{course.credits}</td>
              <td className='px-3 py-2 text-sm'>
                <button onClick={() => handleToggleStatus(course.code)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${course.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                  {course.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className='px-3 py-2 text-right text-sm'>
                <button onClick={() => handleEdit(course)} className='rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700'>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {filteredCourses.length === 0 && <p className='mt-4 text-center text-sm text-gray-500'>No courses found.</p>}
    </div>
  );
};

export default DashboardAdmin;
