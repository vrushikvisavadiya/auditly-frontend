"use client ";
import { useEffect } from "react";

interface ModalProps {
  id: string;
  title: string;
  description: string;
  header: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
  defaultOpen?: boolean;
}

export default function Modal(props: ModalProps) {
  useEffect(() => {
    if (props.defaultOpen) {
      const dialog = document.getElementById(
        props.id
      ) as HTMLDialogElement | null;
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    }
  }, [props.id, props.defaultOpen]);
  const handleClose = () => {
    const dialog = document.getElementById(
      props.id
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
    }
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <dialog id={props.id} className="modal modal-bottom sm:modal-middle ">
      <div className="modal-box rounded-t-2xl sm:rounded-2xl p-0 max-w-md">
        {props.header}
        <div className="flex flex-col gap-4 p-6 items-center justify-center">
          <h3 className="text-[var(--auditly-dark-blue)] text-center [font-family:Poppins] text-xl font-semibold leading-[normal]">
            {props.title}
          </h3>
          <p className="text-[var(--auditly-dark-blue)] text-center [font-family:Poppins] text-sm font-normal leading-[normal]">
            {props.description}
          </p>
          {props.children}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
}

function GreenBackground(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-4 justify-end items-center gap-2.5 self-stretch bg-[#EAF7ED] px-0">
      <div className="flex justify-center items-center [background:rgba(40,167,69,0.05)] shadow-[0_5px_4px_0_rgba(40,167,69,0.20)] p-5 rounded-full overflow-visible">
        {props.children}
      </div>
    </div>
  );
}

export function CheckModalHeader() {
  return (
    <GreenBackground>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        className="overflow-visible"
      >
        <path
          d="M30 0C13.5223 0 0 13.5223 0 30C0 46.4777 13.5223 60 30 60C46.4777 60 60 46.4777 60 30C60 13.5223 46.4777 0 30 0ZM33.8855 37.8483C29.8986 41.7617 23.465 41.6019 19.6773 37.4955L15.4374 32.8989C14.2053 31.5632 14.2471 29.4932 15.532 28.2082C16.9578 26.7824 19.3059 26.9107 20.5679 28.4834L22.3685 30.7273C24.6148 33.5267 28.8066 33.7229 31.3046 31.1457L40.8846 21.262C42.2772 19.8253 44.5934 19.862 45.9397 21.3422C47.1938 22.721 47.1337 24.8445 45.8035 26.1501L33.8855 37.8483Z"
          fill="#28B446"
        />
        <path
          d="M30 -5C49.2392 -5 65 10.7608 65 30C65 49.2392 49.2392 65 30 65C10.7608 65 -5 49.2392 -5 30C-5 10.7608 10.7608 -5 30 -5Z"
          stroke="#28A745"
          strokeOpacity="0.1"
          strokeWidth="10"
        />
      </svg>
    </GreenBackground>
  );
}
