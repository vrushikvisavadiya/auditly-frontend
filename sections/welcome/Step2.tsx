// sections/welcome/Step2.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  completeStep,
  Step2Data,
  updateFormData,
} from "@/src/redux/slices/welcomeSlice";
import { useState, useRef, useEffect } from "react";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

// Fixed Custom MultiSelect Component
interface MultiSelectProps {
  options: Array<{ name: string; id: string }>;
  selectedValues: Array<{ name: string; id: string }>;
  onSelect: (selectedList: Array<{ name: string; id: string }>) => void;
  placeholder: string;
  searchable?: boolean;
}

function CustomMultiSelect({
  options,
  selectedValues,
  onSelect,
  placeholder,
  searchable = true,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleOptionToggle = (option: { name: string; id: string }) => {
    const isSelected = selectedValues.some((item) => item.id === option.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedValues.filter((item) => item.id !== option.id);
    } else {
      newSelection = [...selectedValues, option];
    }

    onSelect(newSelection);
  };

  // Remove selected item
  const removeItem = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedValues.filter((item) => item.id !== optionId);
    onSelect(newSelection);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search when closing
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main Input Display */}
      <div
        className={`min-h-[30px] p-2 border-1 rounded-lg cursor-pointer transition-colors ${
          isOpen
            ? "border-[var(--auditly-orange)] ring-2 ring-[var(--auditly-orange)]/20"
            : "border-gray-300 hover:border-gray-400"
        } bg-white flex flex-wrap gap-2 items-center`}
        onClick={toggleDropdown}
      >
        {/* Selected Items */}
        {selectedValues.length === 0 ? (
          <span className="text-gray-400 flex-1">{placeholder}</span>
        ) : (
          <>
            {selectedValues.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center px-2 py-1 bg-[var(--auditly-orange)]/20 text-black text-xs rounded-md gap-1"
              >
                {item.name}
                <button
                  type="button"
                  onClick={(e) => removeItem(item.id, e)}
                  className="hover:text-red-200 ml-1"
                  aria-label={`Remove ${item.name}`}
                >
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            ))}
          </>
        )}

        {/* Dropdown Arrow */}
        <div className="ml-auto">
          <Icon
            name={isOpen ? "expand_less" : "expand_more"}
            className="text-gray-400"
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search options..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:border-[var(--auditly-dark-blue)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? "No options found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.some(
                  (item) => item.id === option.id
                );
                return (
                  <div
                    key={option.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleOptionToggle(option)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option)}
                      className="w-4 h-4 text-[var(--auditly-orangre)] rounded focus:ring-[var(--auditly-dark-blue)]/20"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1">
                      {option.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Step2({ onNext, onPrev }: Step2Props) {
  const dispatch = useAppDispatch();
  interface Step2FormData {
    providerType?: string;
    operatingStates?: Array<{ name: string; id: string }>;
    businessDescription?: string;
    registrationGroups?: Array<{ name: string; id: string }>;
  }

  const formData: Step2FormData = useAppSelector(
    (state) => state.welcome.formData[2] || {}
  );

  const [data, setData] = useState({
    providerType: formData.providerType || "",
    operatingStates: formData.operatingStates || [],
    businessDescription: formData.businessDescription || "",
    registrationGroups: formData.registrationGroups || [],
  });

  // States/territories options
  const stateOptions = [
    { name: "Australian Capital Territory (ACT)", id: "ACT" },
    { name: "New South Wales (NSW)", id: "NSW" },
    { name: "Northern Territory (NT)", id: "NT" },
    { name: "Queensland (QLD)", id: "QLD" },
    { name: "South Australia (SA)", id: "SA" },
    { name: "Tasmania (TAS)", id: "TAS" },
    { name: "Victoria (VIC)", id: "VIC" },
    { name: "Western Australia (WA)", id: "WA" },
  ];

  // Registration groups options
  const registrationGroupOptions = [
    { name: "0136 - Therapeutic Supports", id: "0136" },
    {
      name: "0104 - Assistance in Coordinating or Managing Life Stages, Transitions and Supports",
      id: "0104",
    },
    {
      name: "0117 - Management of Funding for Supports (Plan Management)",
      id: "0117",
    },
    { name: "0125 - Therapeutic Supports", id: "0125" },
    { name: "0122 - Specialist Support Coordination", id: "0122" },
    { name: "0116 - Development of Daily Living and Life Skills", id: "0116" },
    { name: "0101 - Assistance with Self-Care Activities", id: "0101" },
    {
      name: "0102 - Assistance with Social and Community Participation",
      id: "0102",
    },
    { name: "0103 - Daily Tasks/Shared Living", id: "0103" },
    { name: "0106 - Communication and Information Systems", id: "0106" },
    { name: "0107 - Therapeutic Supports", id: "0107" },
    { name: "0108 - Early Childhood Supports", id: "0108" },
    { name: "0109 - Behaviour Support", id: "0109" },
    { name: "0111 - Specialist Disability Accommodation", id: "0111" },
    { name: "0112 - Personal Mobility Equipment", id: "0112" },
    { name: "0113 - Personal Activities High Intensity", id: "0113" },
    { name: "0114 - Hearing Services", id: "0114" },
    { name: "0115 - Vision Services", id: "0115" },
    { name: "0118 - Psychosocial Recovery Coaching", id: "0118" },
    { name: "0119 - Group and Centre Based Activities", id: "0119" },
    { name: "0120 - Accommodation/Tenancy", id: "0120" },
    { name: "0121 - Household Tasks", id: "0121" },
    { name: "0123 - Interpreting and Translation", id: "0123" },
    { name: "0124 - Specialist Behaviour Intervention Supports", id: "0124" },
    { name: "0126 - Innovative Community Participation", id: "0126" },
    { name: "0127 - High Intensity Daily Personal Activities", id: "0127" },
    { name: "0128 - Nursing", id: "0128" },
    { name: "0129 - Meal Preparation", id: "0129" },
    { name: "0130 - Linen Service", id: "0130" },
  ];

  const handleProviderTypeChange = (type: string) => {
    setData({ ...data, providerType: type });
  };

  const handleNext = () => {
    dispatch(completeStep(2));
    dispatch(
      updateFormData({
        step: 2,
        data: {
          providerType: data.providerType,
          customSettings: Object.fromEntries(
            (data.operatingStates || []).map((s) => [s.id, s.name])
          ),
          operatingStates: (data.operatingStates || [])
            .map((s) => s.id)
            .join(","),
          businessDescription: data.businessDescription,
          // registrationGroups: data.registrationGroups,
        },
      })
    );
    onNext();
  };

  const isFormValid = () => {
    return (
      data.providerType &&
      data.operatingStates.length > 0 &&
      data.businessDescription.trim() &&
      data.registrationGroups.length > 0
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="mb-2 text-left">
        <h1 className="text-3xl font-bold text-[var(--auditly-dark-blue)]">
          Organisation Discovery
        </h1>
        {/* <p className="text-lg text-gray-600">
          Tell us about your organization to customize your NDIS policies.
        </p> */}
      </div>

      {/* Scrollable Form Content */}
      <div className="space-y-8">
        {/* Section 1: Provider Type */}
        <div className="">
          <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-4">
            Are you an NDIS provider or Home Care provider?
          </h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--auditly-orange)] transition-colors">
              <div className="relative">
                <input
                  type="radio"
                  name="providerType"
                  value="NDIS"
                  checked={data.providerType === "NDIS"}
                  onChange={() => handleProviderTypeChange("NDIS")}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[var(--auditly-orange)] peer-checked:bg-[var(--auditly-orange)] flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="ml-3 text-lg font-medium text-gray-700">
                NDIS
              </span>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--auditly-orange)] transition-colors">
              <div className="relative">
                <input
                  type="radio"
                  name="providerType"
                  value="Home Care"
                  checked={data.providerType === "Home Care"}
                  onChange={() => handleProviderTypeChange("Home Care")}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[var(--auditly-orange)] peer-checked:bg-[var(--auditly-orange)] flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="ml-3 text-lg font-medium text-gray-700">
                Home Care
              </span>
            </label>
          </div>
        </div>

        {/* Section 2: Operating States */}
        {data.providerType && (
          <div className="">
            <h3 className="text-base font-semibold text-[var(--auditly-dark-blue)] mb-2">
              What state or territory do you operate in? (You can choose more
              than one)
            </h3>
            <p className="text-gray-600 text-[10px] mb-2">
              This helps me check which state-specific policies you need.
            </p>

            <CustomMultiSelect
              options={stateOptions}
              selectedValues={data.operatingStates}
              onSelect={(selectedList) =>
                setData({ ...data, operatingStates: selectedList })
              }
              placeholder="Type or select territories"
            />
          </div>
        )}

        {/* Section 3: Business Description */}
        {data.operatingStates.length > 0 && (
          <div className="">
            <h3 className="text-base font-semibold text-[var(--auditly-dark-blue)] mb-2">
              Perfect! Now tell me a bit about your business. What kind of
              services do you provide? Write in your own words.
            </h3>

            <p className="text-sm text-[var(--auditly-light-blue)] mb-6">
              (Use simple words; I’ll detect your registration groups for you.)
            </p>

            <textarea
              value={data.businessDescription}
              onChange={(e) =>
                setData({ ...data, businessDescription: e.target.value })
              }
              placeholder="We're a small family business. I'm an occupational therapist, and we also help with support coordination for our NDIS clients."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-base leading-relaxed"
            />
          </div>
        )}

        {/* Section 4: Registration Groups */}
        {data.businessDescription.trim() && (
          <div className="">
            <div className="mb-6">
              <div className="">
                <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-2">
                  Thanks! Based on what you shared, I think these registration
                  groups fit your business:
                </h3>
              </div>

              <div>
                {[
                  { name: "0136 - Therapeutic Supports", id: "0136" },
                  { name: "0137 - Therapeutic Supports", id: "0137" },
                ].map((reg) => (
                  <div key={reg.id} className="mb-1">
                    <div className="inline-flex items-center px-2 py-1 bg-[var(--auditly-orange)]/20 text-black text-xs rounded-md gap-1">
                      <p>{reg.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Select Registration Groups:
              </label>

              <CustomMultiSelect
                options={registrationGroupOptions}
                selectedValues={data.registrationGroups}
                onSelect={(selectedList) =>
                  setData({ ...data, registrationGroups: selectedList })
                }
                placeholder="Search and select registration groups..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}

      <div className=" mt-12 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-[var(--auditly-dark-blue)] text-base mb-4">
          Please review your selection before continuing
        </h4>

        <div className="flex justify-start gap-2 items-center">
          <Button
            onClick={onPrev}
            // iconLeft={<Icon name="arrow_back" />}
            className="px-6 py-3 btn-orange"
          >
            ❌ Discard Selection
          </Button>
          <Button
            onClick={handleNext}
            // disabled={!isFormValid()}
            // iconRight={<Icon name="arrow_forward" />}
            className="px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Confirm Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
