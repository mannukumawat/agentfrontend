import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/profile");
      } else {
        navigate("/agent");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex flex-col md:flex-row bg-white  overflow-hidden max-w-5xl w-full">
        {/* Left Side - Logo */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-indigo-50 to-gray-100 p-10">
          <div className="flex flex-col items-center">
            <div className="text-indigo-900 font-bold text-6xl mb-2">A</div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
              Agent calling
            </h1>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full py-2 mt-2 text-white font-semibold rounded-lg bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            ©2025 AgentCall. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
