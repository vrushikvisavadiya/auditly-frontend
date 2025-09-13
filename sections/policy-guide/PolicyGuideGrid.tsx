"use client";

import Link from "next/link";
// import Playiconstep1 from "../../public/icons/playiconstep1.svg";

const videos = Array.from({ length: 9 }).map((_, idx) => ({
  id: String(idx + 1),
  title: "Policy Name",
  createdAt: "30 mins",
  createdBy: "Tania Gomez",
}));

export default function PolicyGuideGrid({
  searchTerm = "",
}: {
  searchTerm?: string;
}) {
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredVideos.map((video) => (
          <Link key={video.id} href={`/policy-guide/${video.id}`}>
            <div
              className="bg-white border border-[rgba(88,120,187,0.10)] p-4 flex flex-col items-center justify-center cursor-pointer transition hover:ring-2 hover:ring-[#FF7F7F] min-h-[150px]"
              style={{ borderRadius: "var(--Corner-Small, 8px)" }}
            >
              <div className="w-full flex justify-center items-center mb-4">
                {/* <div className="w-16 h-16">
                  <Playiconstep1 className="w-full h-full" />
                </div> */}
                <svg
                  width="43"
                  height="44"
                  viewBox="0 0 43 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.666992"
                    width="42.6667"
                    height="42.6667"
                    rx="21.3333"
                    fill="#FF0000"
                  />
                  <path
                    d="M29.667 22.0007L17.167 16.5158V27.4855L29.667 22.0007Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            <div className="w-full py-2">
              <div className="font-semibold mb-1 text-gray-900">
                {video.title}
              </div>
              <div className="text-xs text-gray-500">
                {video.createdAt} | Created by {video.createdBy}
              </div>
            </div>
          </Link>
        ))}
        {filteredVideos.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-16">
            No policies found.
          </div>
        )}
      </div>
    </div>
  );
}
