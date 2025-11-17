import TopBar from "../components/topbar/TopBar";
import Footer from "../components/footer/Footer";

function DashboardUser() {
  return (
    <>
      <TopBar />

      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, Lorenzo 👋
          </h1>
          <p className="text-gray-600 mb-8">
            Here’s your personalized student dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Current Term
              </h2>
              <p className="text-lg font-semibold text-gray-900">Fall 2025</p>
              <p className="text-sm text-gray-500">Status: Active & Registered</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Enrolled Courses
              </h2>
              <ul className="text-sm text-gray-700 leading-relaxed">
                <li>• Web Programming</li>
                <li>• OOP</li>
                <li>• RAD</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Notifications
              </h2>
              <p className="text-sm text-gray-700">
                You have 2 unread messages from Admin.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DashboardUser;
