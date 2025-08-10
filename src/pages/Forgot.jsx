import React, { useState } from "react";
import api from "../services/api";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.authPost("/forgot", { email });
      setMessage("If that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.message || "Request failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-2">{message}</div>
      )}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <button className="px-4 py-2 bg-yellow-600 text-white rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
