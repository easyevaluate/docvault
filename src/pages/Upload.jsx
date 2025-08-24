import React, { useState, useRef } from "react";
import api from "../services/api";
import { VscRunAbove } from "react-icons/vsc";
import { FiUploadCloud } from "react-icons/fi";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  async function uploadFile(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", selectedFile);

      await api.filesPost("/upload", form, true);
      setMessage("Upload successful!");
      window.dispatchEvent(new Event("files-updated"));

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) uploadFile(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) uploadFile(droppedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="p-4 border border-gray-200 rounded bg-white">
      <h2 className="font-semibold mb-3 text-lg flex items-center gap-2">
        <VscRunAbove className="text-blue-600 text-xl" /> Upload File
      </h2>

      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-2 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">{error}</div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex items-center justify-center w-full"
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUploadCloud className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG, GIF (MAX. 800x400px)
            </p>
            {file && (
              <p className="mt-2 text-sm text-blue-600 font-medium">
                {loading ? "Uploading..." : `Selected: ${file.name}`}
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
