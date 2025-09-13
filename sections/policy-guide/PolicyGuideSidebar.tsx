"use client";
import { useState } from "react";

const coreModulePolicies = [
  "Aboriginal and Torres Strait Islander People Policy and Procedure",
  "Person-Centred Supports Policy and Participant Service Charter of Rights",
  "Preferred Method of Communication Policy and Procedure",
  "Pathogenic Service Charter of Rights",
  "Preferred Method of Communication Policy and Procedure",
  "Person-Centred Supports Lifestyle Policy and Procedure",
  "Advocacy Support Policy and Procedure",
  "Individual Values and Beliefs Policy and Procedure",
  "Privacy and Dignity Policy and Procedure",
  "Management of Data Breach Policy and Procedure",
  "Decision Making and Informed Choice and Procedure",
  "Violence, Harm, Neglect, Exploitation and Discrimination Policy and Procedure",
];

export default function PolicyGuideSidebar() {
  const [isCoreModuleOpen, setIsCoreModuleOpen] = useState(true);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6">
      <h2 className="mb-4 font-bold text-lg">Browse Policies</h2>

      <div className="flex flex-col gap-2">
        {/* Core Module Accordion */}
        <div className="border border-[rgba(88,120,187,0.10)] bg-[linear-gradient(0deg,rgba(88,120,187,0.10)_0%,rgba(88,120,187,0.10)_100%),#FFF] rounded-md">
          {/* Accordion Header */}
          <button
            onClick={() => setIsCoreModuleOpen(!isCoreModuleOpen)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-black/5 transition-colors rounded-md"
          >
            <span className="text-sm font-semibold text-gray-800">
              Core Module
            </span>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isCoreModuleOpen ? "rotate-180" : ""
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
          </button>

          {/* Accordion Content */}
          {isCoreModuleOpen && (
            <div className="px-3 pb-3">
              <div className="flex flex-col gap-1">
                {coreModulePolicies.map((policy, idx) => (
                  <button
                    key={idx}
                    className="text-left hover:bg-white/50 p-2 rounded text-sm font-medium text-gray-700 transition-colors"
                  >
                    {policy}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
