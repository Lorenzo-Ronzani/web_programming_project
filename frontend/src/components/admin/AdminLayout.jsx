import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import TopBar from "../topbar/TopBar"; 



/*
  AdminLayout (TopBar + Sidebar + Content)
  -------------------------------------------------------
  - Uses the existing TopBar component from your system
  - Sidebar is displayed below the topbar
  - Content is aligned correctly at the right
  - No custom header is created, everything uses your TopBar
*/

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/** ------------------------------
       * TOPBAR (the REAL one from your system)
       * ------------------------------ */}
      <TopBar />

      {/** ------------------------------
       * LAYOUT BODY
       * Sidebar LEFT + Content RIGHT
       * ------------------------------ */}
      <div className="flex flex-1 w-full">

        {/** ---- SIDEBAR ---- */}
        <aside className="w-64 bg-white shadow-md border-r min-h-[calc(100vh-64px)]">
          <SidebarAdmin />
        </aside>

        {/** ---- MAIN CONTENT ---- */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
