import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/AuthContext";

/*
  TopBar Component
  ---------------------
  - Displays the main header with the app logo, title, and user menu.
  - Uses the AuthContext to access current user info.
  - Keeps track of which section is active using IntersectionObserver.
  - Cleaned up: user avatar and name are now shown only inside UserMenu.
*/

const TopBar = () => {
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef(null);
  const { user } = useAuth(); // Access current logged-in user (from AuthContext)

  // Intersection Observer:
  // Detects which section is visible to highlight navigation items dynamically
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 } // 40% of the section must be visible
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <header className="w-full border-b border-gray-200 bg-white px-6 py-2 relative z-10 shadow-sm">
      <div className="flex items-center justify-between">
        {/* ==== Left Side: Logo and Title ==== */}
        <Link
          to="/"
          className="flex items-center space-x-3 group hover:opacity-90 transition"
        >
          {/* App Logo */}
          <div className="bg-black flex h-10 w-10 items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-3xl text-white">
              school
            </span>
          </div>

          {/* App Name + Subtitle */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              Bow Programs Portal
            </h1>
            <p className="text-md text-gray-500">Empowering Student Success</p>
          </div>
        </Link>

        {/* ==== Right Side: Notifications + User Menu ==== */}
        <div className="flex items-center space-x-4" ref={menuRef}>
          {/* Notification Button (placeholder for future feature) */}
          <button
            title="Notifications"
            className="relative flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* User Menu (Handles avatar, name, login, and logout) */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
