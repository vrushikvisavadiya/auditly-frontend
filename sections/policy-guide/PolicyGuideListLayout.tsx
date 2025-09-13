"use client";
import { useState } from "react";
import PolicyGuideSidebar from "./PolicyGuideSidebar";
import PolicyGuideGrid from "./PolicyGuideGrid";

export default function PolicyGuideListLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PolicyGuideSidebar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-2">Policy Guide</h1>
          <div className="relative w-80 mb-6">
            <input
              type="search"
              placeholder="Search Policy"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border px-3 py-2 pr-10 rounded-md text-sm"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>
        </div>
        <p className="mb-4 text-gray-600">
          Explore our collection of videos and guides designed to help you
          understand NDIS policies with ease.
        </p>

        {/* Search Input */}

        {/* Pass searchTerm to PolicyGuideGrid */}
        <PolicyGuideGrid searchTerm={searchTerm} />
      </main>
    </div>
  );
}
