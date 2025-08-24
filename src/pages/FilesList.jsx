import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import { BsFilePdf } from "react-icons/bs";

export default function FilesList() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState({});
  const [fileBlobs, setFileBlobs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format file size
  const formatFileSize = (size) => {
    if (!size) return "";
    return size >= 1024 * 1024
      ? (size / (1024 * 1024)).toFixed(2) + " MB"
      : (size / 1024).toFixed(2) + " KB";
  };

  // Load files list
  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.filesGet("/");
      setFiles(res.data || []);
    } catch (err) {
      setError(err.message || "Could not load files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
    const handler = () => loadFiles();
    window.addEventListener("files-updated", handler);
    return () => window.removeEventListener("files-updated", handler);
  }, [loadFiles]);

  // Generate previews and store blobs for reuse
  useEffect(() => {
    let isCancelled = false;

    async function generatePreviews() {
      const blobs = {};
      const previewsMap = {};

      await Promise.all(
        files.map(async (file) => {
          try {
            const blob = await api.filesGet(`/download/${file.id}`);
            // Store blob for download later
            blobs[file.id] = blob;
            // If image, create preview URL
            if (file.mimetype?.startsWith("image/")) {
              previewsMap[file.id] = URL.createObjectURL(blob);
            }
          } catch (err) {
            console.error(`Failed to load preview for ${file.id}`, err);
          }
        })
      );

      if (!isCancelled) {
        setFileBlobs(blobs);
        setPreviews(previewsMap);
      }
    }

    if (files.length > 0) generatePreviews();

    return () => {
      isCancelled = true;
      Object.values(previews).forEach(URL.revokeObjectURL);
    };
  }, [files]);

  // Download using stored blob
  const downloadFile = (id, filename) => {
    const blob = fileBlobs[id];
    if (!blob) {
      alert("File not loaded yet, please try again.");
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // Delete file
  const removeFile = async (id) => {
    if (!confirm("Delete this file?")) return;
    try {
      await api.filesDelete("/delete/" + id);
      loadFiles();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="rounded bg-white py-4">
      <h2 className="font-semibold mb-4">Your Files</h2>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && files.length === 0 && (
        <div className="text-gray-600">No files yet.</div>
      )}

      <ul className="space-y-2">
        {files.map((f) => (
          <li
            key={f.id || f._id}
            className="flex items-center justify-between gap-4 p-3 border border-gray-200 rounded hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4">
              {f.mimetype?.startsWith("image/") ? (
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
                  {previews[f.id] ? (
                    <img
                      src={previews[f.id]}
                      alt={f.originalname || f.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="animate-pulse w-full h-full bg-gray-300"></div>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-gray-500">
                  <BsFilePdf className="text-2xl" />
                </div>
              )}

              <div>
                <div
                  className="font-medium block max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
                  title={f.originalname || f.filename || "Unnamed"}
                >
                  {f.originalname || f.filename || "Unnamed"}
                </div>
                <div className="text-sm text-gray-600">
                  {formatFileSize(f.size)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(f.id, f.originalname)}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                title="Download"
              >
                <FiDownload className="text-lg text-gray-700" />
              </button>
              <button
                onClick={() => removeFile(f.id || f._id)}
                className="p-2 rounded bg-red-600 hover:bg-red-700 transition cursor-pointer"
                title="Delete"
              >
                <FiTrash2 className="text-lg text-white" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
