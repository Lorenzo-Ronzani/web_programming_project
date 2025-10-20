import SidebarMenu from '../components/sidebarMenu/SidebarMenu';

function Dashboard() {
  return (
    <div className="min-h-screen flex">
      <SidebarMenu />
      <div className="flex-1 bg-gray-50">
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
          <p className="text-gray-600">
            Welcome to your student dashboard! From here, you can explore programs, register for courses,
            and manage your academic information.
          </p>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
