import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../apis/endpoints/auth";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await authApi.register({ fullname, email, password });
      setMessage("Registration successful. Please check your email to verify.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-2">{message}</div>
      )}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}
