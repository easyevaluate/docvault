import React, { useState } from "react";
import api from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Reset() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.authPost("/reset", { token, password });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.message || "Reset failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-2">{message}</div>
      )}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full p-2 border rounded"
        />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
