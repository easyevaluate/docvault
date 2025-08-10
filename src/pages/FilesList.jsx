import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function FilesList() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.filesGet("/");
      setFiles(res.data || []);
    } catch (err) {
      setError(err.message || "Could not load files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("files-updated", handler);
    return () => window.removeEventListener("files-updated", handler);
  }, []);

  async function downloadFile(id, filename) {
    try {
      const blob = await api.filesDownload("/download/" + id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Download failed");
    }
  }

  async function removeFile(id) {
    if (!confirm("Delete this file?")) return;
    try {
      await api.filesDelete("/" + id);
      load();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div className="rounded bg-white">
      <h2 className="font-semibold mb-2">Your Files</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && files.length === 0 && (
        <div className="text-gray-600">No files yet.</div>
      )}
      <ul className="space-y-2">
        {files.map((f) => (
          <li
            key={f.id || f._id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div>
              <div className="font-medium">
                {f.originalname || f.filename || "Unnamed"}
              </div>
              <div className="text-sm text-gray-600">
                {f.size
                  ? f.size >= 1024 * 1024
                    ? (f.size / (1024 * 1024)).toFixed(2) + " MB"
                    : (f.size / 1024).toFixed(2) + " KB"
                  : ""}
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => downloadFile(f.id)}
                className="px-2 py-1 border rounded cursor-pointer"
              >
                Download
              </button>
              <button
                onClick={() => removeFile(f.id || f._id)}
                className="px-2 py-1 bg-red-600 text-white rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
