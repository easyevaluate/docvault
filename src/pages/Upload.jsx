import React, { useState } from "react";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file) return setError("Choose file first");
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.filesPost("/upload", form, true);
      setMessage("Upload successful");
      window.dispatchEvent(new Event("files-updated"));
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="font-semibold mb-2">Upload File</h2>
      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-2">{message}</div>
      )}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-2">{error}</div>}
      <form onSubmit={submit} className="flex items-center gap-3">
        <input
          type="file"
          className="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
