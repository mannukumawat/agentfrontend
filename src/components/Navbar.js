import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dateTime, setDateTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      setDateTime(formatted);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 border rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <Link
              to={user.role === "admin" ? "/admin" : "/agent"}
              className="text-xl font-bold text-black"
            >
              CRM Dashboard
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-black">
            <Link to="/customers" className="hover:text-gray-600">Customers</Link>
            {user.role === "admin" && (
              <Link to="/agents" className="hover:text-gray-600">Agent</Link>
            )}
          
            <Link to="/profile" className="hover:text-gray-600">Profile</Link>
            <span className="font-medium">{dateTime}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4 text-black">
            <Link to="/customers" className="hover:text-gray-600">Customers</Link>
            {user.role === "admin" && (
              <Link to="/agents" className="hover:text-gray-600">Agent</Link>
            )}
            <Link to="/profile" className="hover:text-gray-600">Profile</Link>
            <span className="font-medium">{dateTime}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 w-24"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}