// components/ui/ConfirmationModal.tsx
"use client";
import { useEffect } from "react";

interface ConfirmationModalProps {
  id: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  defaultOpen?: boolean;
  variant?: "danger" | "warning" | "info";
}

function WarningBackground(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-4 justify-end items-center gap-2.5 self-stretch bg-[var(--auditly-orange)]/10 px-0">
      <div className="flex justify-center items-center [background:rgba(255,193,7,0.05)] shadow-[0_5px_4px_0_rgba(255,193,7,0.20)] p-5 rounded-full overflow-visible">
        {props.children}
      </div>
    </div>
  );
}

function DangerBackground(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-4 justify-end items-center gap-2.5 self-stretch bg-[var(--auditly-orange)] px-0">
      <div className="flex justify-center items-center [background:rgba(220,53,69,0.05)] shadow-[0_5px_4px_0_rgba(220,53,69,0.20)] p-5 rounded-full overflow-visible">
        {props.children}
      </div>
    </div>
  );
}

function InfoBackground(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-4 justify-end items-center gap-2.5 self-stretch bg-[#D1ECF1] px-0">
      <div className="flex justify-center items-center [background:rgba(23,162,184,0.05)] shadow-[0_5px_4px_0_rgba(23,162,184,0.20)] p-5 rounded-full overflow-visible">
        {props.children}
      </div>
    </div>
  );
}

export function LogoutModalHeader() {
  return (
    <WarningBackground>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        className="overflow-visible"
      >
        <path
          d="M30 0C13.5223 0 0 13.5223 0 30C0 46.4777 13.5223 60 30 60C46.4777 60 60 46.4777 60 30C60 13.5223 46.4777 0 30 0ZM30 45C28.3431 45 27 43.6569 27 42C27 40.3431 28.3431 39 30 39C31.6569 39 33 40.3431 33 42C33 43.6569 31.6569 45 30 45ZM33 33H27V15H33V33Z"
          fill="var(--auditly-orange)"
        />
        <path
          d="M30 -5C49.2392 -5 65 10.7608 65 30C65 49.2392 49.2392 65 30 65C10.7608 65 -5 49.2392 -5 30C-5 10.7608 10.7608 -5 30 -5Z"
          stroke="var(--auditly-orange)"
          strokeOpacity="0.1"
          strokeWidth="10"
        />
      </svg>
    </WarningBackground>
  );
}

export function DangerModalHeader() {
  return (
    <DangerBackground>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        className="overflow-visible"
      >
        <path
          d="M30 0C13.5223 0 0 13.5223 0 30C0 46.4777 13.5223 60 30 60C46.4777 60 60 46.4777 60 30C60 13.5223 46.4777 0 30 0ZM32.5 42.5H27.5V37.5H32.5V42.5ZM32.5 32.5H27.5V17.5H32.5V32.5Z"
          fill="#DC3545"
        />
        <path
          d="M30 -5C49.2392 -5 65 10.7608 65 30C65 49.2392 49.2392 65 30 65C10.7608 65 -5 49.2392 -5 30C-5 10.7608 10.7608 -5 30 -5Z"
          stroke="#C82333"
          strokeOpacity="0.1"
          strokeWidth="10"
        />
      </svg>
    </DangerBackground>
  );
}

export function InfoModalHeader() {
  return (
    <InfoBackground>
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
          fill="#17A2B8"
        />
        <path
          d="M30 -5C49.2392 -5 65 10.7608 65 30C65 49.2392 49.2392 65 30 65C10.7608 65 -5 49.2392 -5 30C-5 10.7608 10.7608 -5 30 -5Z"
          stroke="#138496"
          strokeOpacity="0.1"
          strokeWidth="10"
        />
      </svg>
    </InfoBackground>
  );
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    id,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    onClose,
    defaultOpen = false,
    variant = "warning",
  } = props;

  useEffect(() => {
    if (defaultOpen) {
      const dialog = document.getElementById(id) as HTMLDialogElement | null;
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    }
  }, [id, defaultOpen]);

  const handleClose = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  const getHeader = () => {
    switch (variant) {
      case "danger":
        return <DangerModalHeader />;
      case "info":
        return <InfoModalHeader />;
      case "warning":
      default:
        return <LogoutModalHeader />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "warning":
      default:
        return "bg-[var(--auditly-orange)] hover:bg-orange-700 text-white";
    }
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box rounded-t-2xl sm:rounded-2xl p-0 max-w-md">
        {getHeader()}
        <div className="flex flex-col gap-4 p-6 items-center justify-center">
          <h3 className="text-[var(--auditly-dark-blue)] text-center [font-family:Poppins] text-xl font-semibold leading-[normal]">
            {title}
          </h3>
          <p className="text-[var(--auditly-dark-blue)] text-center [font-family:Poppins] text-sm font-normal leading-[normal]">
            {description}
          </p>
          <div className="flex gap-3 mt-2 w-full">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${getConfirmButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
