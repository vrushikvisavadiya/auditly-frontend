"use client";
import Link from "next/link";
import PolicyGuideSidebar from "./PolicyGuideSidebar";
import PolicyGuideVideoPlayer from "./PolicyGuideVideoPlayer";
import RelatedVideos from "./RelatedVideos";
import { useState } from "react";
import { ROUTES } from "@/src/routes/constants";
import Icon from "@/components/Icon";

export default function PolicyGuideVideoLayout({ id }: { id: string }) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PolicyGuideSidebar />

      {/* Main Content */}
      <main className="flex-1 px-10 py-8">
        {/* Breadcrumb & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
          <nav className="text-sm text-[#8A90A3] mb-1">
            <Link href={ROUTES.POLICY_GUIDE}> Policy Guide </Link>{" "}
            <span className="mx-1">›</span>{" "}
            <span className="text-[#39509D]">Policy Name</span>
          </nav>
        </div>

        {/* Page Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-3">Policy Guide</h1>

          <div className="relative w-80 max-w-full">
            <input
              type="search"
              placeholder="Search Policy"
              className="border border-gray-300 px-4 py-2 pr-10 rounded-md text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
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
        {/* Video Info */}
        <div className="mb-2 font-semibold text-lg text-[#233066]">
          Policy Name
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Icon name="schedule" className="w-8" />
          35 secs
          <span> | Created by: Tania Gomez</span>
        </div>
        <div className="mb-4 text-gray-500 text-sm">Policy Summary</div>

        {/* Video Card */}
        <PolicyGuideVideoPlayer id={id} />

        {/* Related Policies */}
        <div className="mt-8">
          <div className="font-semibold text-[18px] text-[#233066] mb-3">
            Related Policies
          </div>
          <RelatedVideos />
        </div>
      </main>
    </div>
  );
}
