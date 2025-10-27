import { useEffect, useState, useRef } from "react";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

const HeaderTop = () => {
  const [activeSection, setActiveSection] = useState(""); // Tracks which section is currently visible
  const menuRef = useRef(null); // Used to handle clicks outside the user menu

  // Intersection Observer - highlights navigation items when sections are visible
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 } // 40% of the section must be visible to trigger
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <header className="w-full border-b border-gray-200 bg-white px-6 py-2 relative z-10">
      <div className="flex items-center justify-between">
        
        {/* Clickable logo and title - redirects to Home ("/") */}
        <Link
          to="/"
          className="flex items-center space-x-3 group hover:opacity-90 transition"
        >
          {/* Logo Icon */}
          <div className="bg-black flex h-10 w-10 items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-3xl text-white">
              school
            </span>
          </div>

          {/* Title and subtitle */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              Bow Programs Portal
            </h1>
            <p className="text-md text-gray-500">Empowering Student Success</p>
          </div>
        </Link>

        {/* Main navigation menu */}
        <nav className="hidden items-center space-x-8 lg:flex">
          {/* Anchor link to "Programs" section */}
          {/*
          <a
            href="#programs"
            className={`border-b-2 transition-all ease-in-out duration-300 ${
              activeSection === "programs"
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-600 hover:border-gray-800 hover:text-gray-900"
            }`}
          >
            Our Programs
          </a>
          */}
          {/* Link to the full Courses page (CoursesAll.jsx) */}
          {/*
          <Link
            to="/coursesall"
            className="border-b-2 border-transparent text-gray-600 hover:border-gray-800 hover:text-gray-900 transition-all ease-in-out duration-300"
          >
            Courses
          </Link>
          */}

          {/* Anchor link to "Terms" section */}
          {/*
          <a
            href="#terms"
            className={`border-b-2 transition-all ease-in-out duration-300 ${
              activeSection === "terms"
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-600 hover:border-gray-800 hover:text-gray-900"
            }`}
          >
            Academic Terms
          </a>
          */}
          {/* Anchor link to "Registration" section */}
          {/*
          <a
            href="#registration"
            className={`border-b-2 transition-all ease-in-out duration-300 ${
              activeSection === "registration"
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-600 hover:border-gray-800 hover:text-gray-900"
            }`}
          >
            Registration
          </a>
          */}
        </nav>

        {/* Notifications and User Menu area */}
        <div className="flex items-center space-x-4" ref={menuRef}>
          {/* Notification button (non-functional placeholder) */}
          <button className="relative flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* User icon and dropdown menu */}
          <div className="flex items-center space-x-3">
            {/* User dropdown component */}
            <UserMenu />
          </div>
        </div>

      </div>
    </header>
  );
};

export default HeaderTop;
