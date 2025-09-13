"use client";
import Playiconstep1 from "../../public/icons/playiconstep1.svg";

export default function PolicyGuideVideoPlayer({ id }: { id: string }) {
  return (
    <div
      className="bg-white p-8 mb-2"
      style={{
        border: "1px solid rgba(88, 120, 187, 0.10)",
        borderRadius: "8px",
      }}
    >
      {/* Aspect ratio 16:9 */}
      <div className="w-full aspect-video flex justify-center items-center bg-white">
        <Playiconstep1 className="w-32 h-32 text-red-500" />
      </div>
    </div>
  );
}
