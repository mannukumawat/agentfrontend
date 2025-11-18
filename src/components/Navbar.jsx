import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dateTime, setDateTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        month: "short",
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LEFT SECTION */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 border rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <div className="text-xl font-bold text-blue-600">
              Simple Udhari
            </div>

            <Link
              to={user.role === "admin" ? "/admin" : "/agent"}
              className="text-lg font-semibold ml-2"
            >
              CRM Dashboard
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/customers" className="hover:text-gray-600">Customers</Link>

            {user.role === "admin" && (
              <Link to="/agents" className="hover:text-gray-600">Agents</Link>
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

        {/* MOBILE MENU - SLIDE DOWN */}
        {menuOpen && (
          <div className="md:hidden bg-gray-50 w-full p-4 rounded-md shadow-inner space-y-3 text-black">

            <Link
              to="/customers"
              className="block hover:bg-gray-100 p-2 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Customers
            </Link>

            {user.role === "admin" && (
              <Link
                to="/agents"
                className="block hover:bg-gray-100 p-2 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Agents
              </Link>
            )}

            <Link
              to="/profile"
              className="block hover:bg-gray-100 p-2 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <span className="font-semibold block">{dateTime}</span>

            <Button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full text-center"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
