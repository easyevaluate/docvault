import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/gallery";

import ProtectedRoute from "./components/ProtectedRoute";

import { authApi } from "./apis/endpoints/auth";
import { isLoggedIn } from "./apis/tokens";

export default function App() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-3">
        <div className="container flex justify-between items-center">
          <Link to="/" className="font-bold">
            FileManager
          </Link>
          <div className="space-x-3">
            <Link to="/gallery">Gallery</Link>
            {!isLoggedIn() && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {isLoggedIn() && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={handleLogout} className="ml-2 cursor-pointer">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                Welcome —{" "}
                <Link to="/login" className="text-blue-600">
                  Login
                </Link>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<Reset />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
    </div>
  );
}
