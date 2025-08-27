import React, { useState, useRef } from "react";
import { VscRunAbove } from "react-icons/vsc";
import { FiUploadCloud } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { formatFileSize } from "../utils/file";
import { filesApi } from "../apis/endpoints/files";
import { TbFileSymlink } from "react-icons/tb";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Upload files to server
  async function uploadFiles() {
    if (files.length === 0) return;

    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("folder", "gallery");
      form.append("isPublic", "true");
      files.forEach((file) => form.append("files", file));

      await filesApi.post("/upload", form, true);

      setMessage("Files uploaded successfully!");
      window.dispatchEvent(new Event("files-updated"));

      // Clear files after upload
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "File upload failed");
    } finally {
      setLoading(false);
    }
  }

  // Handle file fetch from URL
  async function handleUrlUpload() {
    if (!fileUrl.trim()) {
      setError("Please enter a valid file URL");
      return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const urlParts = fileUrl.split("/");
      const filename = urlParts[urlParts.length - 1] || "downloaded-file";
      const file = new File([blob], filename, { type: blob.type });

      addFiles([file]);
      setFileUrl("");
      setMessage("File fetched successfully!");
    } catch (err) {
      setError(err.message || "Could not fetch file from URL");
    } finally {
      setLoading(false);
    }
  }

  // Add new files and append to existing
  function addFiles(newFiles) {
    const filesArray = Array.from(newFiles);
    setFiles((prevFiles) => [
      ...prevFiles,
      ...filesArray.filter(
        (f) => !prevFiles.some((pf) => pf.name === f.name && pf.size === f.size)
      ),
    ]);
  }

  // Handle file input change
  function handleFileChange(e) {
    if (e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  }

  // Handle drag and drop
  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  // Remove a single file
  function removeFile(index) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  return (
    <div className="p-4 border border-gray-200 rounded bg-white">
      <h2 className="font-semibold mb-3 text-lg flex items-center gap-2">
        <VscRunAbove className="text-blue-600 text-xl" /> Upload Files
      </h2>

      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-2 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">{error}</div>
      )}

      <div className="flex flex-col justify-center gap-4 w-full">
        {/* URL Upload Section */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter file URL"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="flex-1 border border-gray-300 rounded outline-none px-3 py-2"
          />
          <button
            onClick={handleUrlUpload}
            disabled={!fileUrl || loading}
            className={`px-3 py-2 rounded text-blue-500 bg-gray-50 ${
              !fileUrl || loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <TbFileSymlink className="text-2xl" />
          </button>
        </div>

        <i className="mx-auto">OR</i>

        {/* Manual Upload Section */}
        <div onDrop={handleDrop} onDragOver={handleDragOver}>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUploadCloud className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to select</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG, GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="dropzone-file"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* File List Section */}
        {files.length > 0 && (
          <div className="text-blue-600 font-medium border border-gray-200 rounded-xl p-3">
            <ul className="list-disc list-inside">
              {files.map((f, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <span>{f.name}</span>
                    <span className="text-gray-500 text-sm">
                      ({formatFileSize(f.size)})
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-1 bg-red-100 ml-2 text-red-500 rounded-full cursor-pointer"
                  >
                    <IoMdClose />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadFiles}
          disabled={files.length === 0 || loading}
          className={`w-40 px-4 py-2 rounded cursor-pointer text-white ${
            files.length === 0 || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
