"use client";
import Playiconstep1 from "../../public/icons/playiconstep1.svg";
import Link from "next/link";

const related = [
  { id: "2", title: "Policy Name", mins: "35 secs", author: "Tania Gomez" },
  { id: "3", title: "Policy Name", mins: "35 secs", author: "Tania Gomez" },
  { id: "4", title: "Policy Name", mins: "35 secs", author: "Tania Gomez" },
];

export default function RelatedVideos() {
  return (
    <div className="flex gap-5">
      {related.map((item) => (
        <Link
          key={item.id}
          href={`/policy-guide/${item.id}`}
          className="flex-1 min-w-[180px] max-w-[250px]"
        >
          <div
            className="bg-white flex flex-col justify-center min-h-[150px] items-center transition hover:ring-2 hover:ring-[#FF7F7F] cursor-pointer"
            style={{
              border: "1px solid rgba(88, 120, 187, 0.10)",
              borderRadius: "8px",
              padding: "28px 20px 18px 20px",
            }}
          >
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
            {/* <Playiconstep1 className="w-10 h-10 text-red-500" /> */}
          </div>
          <div className="w-full ">
            <div className="font-semibold text-gray-900 text-sm mb-1">
              {item.title}
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6l4 2"
                />
              </svg>
              {item.mins}
              <span> | Created by: {item.author}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
