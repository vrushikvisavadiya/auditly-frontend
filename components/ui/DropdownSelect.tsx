// components/ui/DropdownSelect.tsx
"use client";
import { useState, useRef, useEffect } from "react";

interface DropdownSelectProps {
  label: string;
  options: string[];
  placeholder?: string;
  selectedValue: string | null;
  onChange: (value: string) => void;
}

export function DropdownSelect({
  label,
  options,
  placeholder = "Select",
  selectedValue,
  onChange,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full mb-8" ref={dropdownRef}>
      <label className="label">
        <span className="label-text text-lg font-medium text-[var(--auditly-dark-blue)]">
          {label}
        </span>
      </label>

      {/* Use proper DaisyUI dropdown structure */}
      <div className="dropdown dropdown-bottom w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-outline w-full justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedValue ? "text-gray-900" : "text-gray-400"}>
            {selectedValue || placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ml-2 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Fixed dropdown menu with proper z-index and positioning */}
        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1000] w-full p-2 shadow-lg border border-gray-200 mt-1 max-h-60 overflow-auto"
            style={{ position: "absolute", top: "100%", left: 0 }}
          >
            {options.length === 0 ? (
              <li>
                <span className="text-gray-500">No options available</span>
              </li>
            ) : (
              options.map((option, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={`text-left w-full rounded-lg ${
                      selectedValue === option
                        ? "bg-[var(--auditly-orange)] text-white font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
