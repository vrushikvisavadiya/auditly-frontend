// components/ui/LoadingModal.tsx
"use client";
import { useEffect, useState } from "react";

interface LoadingModalProps {
  id: string;
  isOpen?: boolean;
  message?: string;
  progress?: number;
  total?: number;
}

export default function LoadingModal({
  id,
  isOpen = false,
  message = "We're preparing your policies. Please hang on for a moment...",
  progress = 0,
  total = 5,
}: LoadingModalProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (!dialog) return;

    if (isOpen) {
      if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
      }
    } else {
      if (dialog.open) dialog.close();
    }
  }, [id, isOpen]);

  // Animate progress changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress, isOpen]);

  // Calculate progress percentage (0 to 100)
  const progressPercentage = (animatedProgress / total) * 100;

  // Calculate stroke dash array for the circle
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box rounded-t-2xl min-h-[300px] flex items-center justify-center sm:rounded-2xl p-0 max-w-md bg-white">
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <div className="mb-6">
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="none"
                />

                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#ff6b35"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-in-out"
                  style={{
                    transformOrigin: "center",
                  }}
                />

                {/* Inner dark circle */}
                {/* <circle
                  cx="32"
                  cy="32"
                  r="20"
                  fill="#1f2937"
                  className="animate-pulse"
                /> */}
              </svg>

              {/* Progress number overlay */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {animatedProgress}/{total}
                </span>
              </div> */}
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 text-base font-bold mb-4 max-w-xs leading-relaxed">
            Retrieving policies ({animatedProgress} out of {total})
          </p>

          {/* Animated loading dots */}
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 rounded-full animate-bounce bg-gray-300"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce bg-orange-300"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce bg-orange-500"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
