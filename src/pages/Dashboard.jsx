import React from "react";
import Upload from "./Upload";
import FilesList from "./FilesList";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6">
        <Upload />
        <FilesList />
      </div>
    </div>
  );
}
