import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Auth integration

/*
  UserMenu Component
  ---------------------
  - Shows logged-in user info (name + photo)
  - Displays dropdown menu for navigation / logout
  - Redirects to login page if no user is logged in
*/

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth(); // ✅ From AuthContext
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/"); // Redirect to main page after logout
  };

  // Menu items (dynamic based on login state)
  const menuItems = user
    ? [
        { label: "User Dashboard", href: "/dashboarduser" },
        { label: "Admin Dashboard", href: "/dashboarduser" },
        { label: "Logout", action: handleLogout, danger: true },
      ]
    : [
        { label: "Login", href: "/login" },
        { label: "Register", href: "/register", disabled: false },
      ];

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Avatar + Name button */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition"
      >
        {/* ✅ User Avatar (dynamic) */}
        <img
          src={
            user
              ? user.photo
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="User Avatar"
          className="h-9 w-9 rounded-full object-cover border border-gray-300"
        />

        {/* ✅ User name and role */}
        <div className="flex flex-col items-start leading-tight text-left">
          <span className="text-sm font-semibold text-gray-800">
            {user ? user.firstName : "Guest"}
          </span>
          <span className="text-xs text-gray-500">
            {user ? user.lastName : "Not logged in"}
          </span>
        </div>

        {/* Dropdown icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-700">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`block px-4 py-2 transition ${
                      item.danger
                        ? "text-red-600 hover:bg-red-100"
                        : item.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className={`block w-full text-left px-4 py-2 transition ${
                      item.danger
                        ? "text-red-600 hover:bg-red-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
