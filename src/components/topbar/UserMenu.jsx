import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    { label: "User Dashboard", href: "/dashboarduser" },
    { label: "Admin Dashboard", href: "/dashboarduser" },
    { label: "Logout", action: () => alert("Logging out..."), danger: true }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Avatar + user info button */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition"
      >
        {/* Local user avatar */}
        <img
          src="/images/avatar.jpg" // Image from public folder
          alt="User Profile"
          className="h-9 w-9 rounded-full object-cover border border-gray-300"
        />

        {/* User name and subtitle */}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-800">Lorenzo</span>
          <span className="text-xs text-gray-500">Ronzani</span>
        </div>

        {/* Dropdown icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dinamic dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-700">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`block px-4 py-2 hover:bg-gray-100 transition ${
                      item.danger ? "text-red-600 hover:bg-red-100" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                      item.danger ? "text-red-600 hover:bg-red-100" : ""
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
