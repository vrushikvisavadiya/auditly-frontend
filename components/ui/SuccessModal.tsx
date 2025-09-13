// components/ui/SuccessModal.tsx
"use client";
import { useEffect } from "react";
import { InfoBackground } from "./ConfirmationModal";

interface SuccessModalProps {
  id: string;
  isOpen?: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
}

export default function SuccessModal({
  id,
  isOpen = false,
  title = "Woohoo! All set!",
  message = "We're preparing your policies. Please hang on for a moment.",
  onClose,
}: SuccessModalProps) {
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

  const handleClose = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
    }
    if (onClose) {
      onClose();
    }
  };

  function InfoModalHeader() {
    return (
      <div className="flex flex-col p-4 py-6 justify-end items-center gap-2.5 self-stretch bg-[#28A745]/20 px-0">
        <div className="flex justify-center items-center [background:rgba(23,162,184,0.05)] shadow-[0_5px_4px_0_rgba(23,162,184,0.20)] p-5 rounded-full overflow-visible">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            className="overflow-visible"
          >
            <path
              d="M30 0C13.5223 0 0 13.5223 0 30C0 46.4777 13.5223 60 30 60C46.4777 60 60 46.4777 60 30C60 13.5223 46.4777 0 30 0ZM27 21H33V27H27V21ZM27 33H33V45H27V33Z"
              fill="#28A745"
            />
            <path
              d="M30 -5C49.2392 -5 65 10.7608 65 30C65 49.2392 49.2392 65 30 65C10.7608 65 -5 49.2392 -5 30C-5 10.7608 10.7608 -5 30 -5Z"
              stroke="#138496"
              strokeOpacity="0.1"
              strokeWidth="10"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box rounded-t-2xl sm:rounded-2xl p-0 max-w-md bg-white">
        <InfoModalHeader />
        <div className="flex flex-col items-center justify-center p-8 text-center">
          {/* Success Icon */}
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mb-6">
            {message}
          </p>

          {/* Loading dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#87c495] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#28A745] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
