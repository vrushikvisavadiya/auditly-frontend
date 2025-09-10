// sections/welcome/Step2.tsx
"use client";
import Button from "@/components/Button";
import MultiSelect, { OptionType } from "@/components/ui/MultiSelect";
import {
  registrationGroupOptions,
  stateOptions,
  suggestedRegistrationGroups,
} from "@/src/constants/dropdownOptions";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

interface Step2FormData {
  providerType?: string;
  operatingStates?: OptionType[];
  businessDescription?: string;
  registrationGroups?: OptionType[];
}

export default function Step2({ onNext, onPrev }: Step2Props) {
  const dispatch = useAppDispatch();

  const formData: Step2FormData = useAppSelector(
    (state) => state.welcome.formData[2] || {}
  );

  const [data, setData] = useState<Step2FormData>({
    providerType: formData.providerType || "",
    operatingStates: formData.operatingStates || [],
    businessDescription: formData.businessDescription || "",
    registrationGroups: formData.registrationGroups || [],
  });

  const handleProviderTypeChange = (type: string) => {
    console.log("Provider type changed to:", type);
    setData({ ...data, providerType: type });
  };

  const handleNext = async () => {
    console.log("=== HANDLE NEXT CLICKED ===");
    console.log("Current data:", data);
    console.log("Form is valid:", isFormValid());

    try {
      // Dispatch actions
      console.log("Dispatching completeStep(2)");
      await dispatch(completeStep(2));

      console.log("Dispatching updateFormData");
      await dispatch(
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
            registrationGroups: data.registrationGroups,
          },
        })
      );

      console.log("Redux actions completed successfully");
      console.log("Calling onNext()");

      // Add a small delay to see console logs before navigation
      setTimeout(() => {
        onNext();
      }, 100);
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  };

  const isFormValid = () => {
    const valid =
      data.providerType &&
      data.operatingStates &&
      data.operatingStates.length > 0 &&
      data.businessDescription &&
      data.businessDescription.trim() &&
      data.registrationGroups &&
      data.registrationGroups.length > 0;

    return valid;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-[var(--auditly-dark-blue)]">
          Organisation Discovery
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Tell us about your organization to customize your NDIS policies.
        </p>
      </div>

      {/* Form Content */}
      <div className="space-y-8">
        {/* Section 1: Provider Type */}
        <div>
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
                  {/* <div className="w-2 h-2 rounded-full bg-white opacity-opacity-0 peer-checked:opacity-100 transition-opacity"></div> */}

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
          <div>
            <h3 className="text-base font-semibold text-[var(--auditly-dark-blue)] mb-2">
              What state or territory do you operate in? (You can choose more
              than one)
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              This helps me check which state-specific policies you need.
            </p>

            <MultiSelect
              options={stateOptions}
              selectedValues={
                Array.isArray(data.operatingStates) ? data.operatingStates : []
              }
              onSelect={(selectedList) => {
                console.log("States selected:", selectedList);
                setData({ ...data, operatingStates: selectedList });
              }}
              placeholder="Type or select territories"
            />
          </div>
        )}
        {/* Section 3: Business Description */}
        {data.operatingStates && data.operatingStates.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-[var(--auditly-dark-blue)] mb-2">
              Perfect! Now tell me a bit about your business. What kind of
              services do you provide? Write in your own words.
            </h3>

            <p className="text-sm text-[var(--auditly-light-blue)] mb-6">
              (Use simple words; I&apos;ll detect your registration groups for
              you.)
            </p>

            <textarea
              value={data.businessDescription || ""}
              onChange={(e) => {
                console.log("Business description changed:", e.target.value);
                setData({ ...data, businessDescription: e.target.value });
              }}
              placeholder="We're a small family business. I'm an occupational therapist, and we also help with support coordination for our NDIS clients."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-base leading-relaxed"
            />
          </div>
        )}

        {/* Section 4: Registration Groups */}
        {data.businessDescription && data.businessDescription.trim() && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-4">
                Thanks! Based on what you shared, I think these registration
                groups fit your business:
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {suggestedRegistrationGroups.map((reg) => (
                  <div
                    key={reg.id}
                    className="inline-flex items-center px-3 py-2 bg-[var(--auditly-orange)]/20 text-black text-sm rounded-md"
                  >
                    {reg.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Select Registration Groups:
              </label>

              <MultiSelect
                options={registrationGroupOptions}
                selectedValues={
                  Array.isArray(data.registrationGroups)
                    ? data.registrationGroups
                    : []
                }
                onSelect={(selectedList) => {
                  console.log("Registration groups selected:", selectedList);
                  setData({ ...data, registrationGroups: selectedList });
                }}
                placeholder="Search and select registration groups..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-[var(--auditly-dark-blue)] text-base mb-4">
          Please review your selection before continuing
        </h4>

        <div className="flex justify-start gap-4 items-center">
          <Button
            onClick={() => {
              console.log("Discard clicked");
              onPrev();
            }}
            className="px-6 py-3 btn-orange"
          >
            ❌ Discard Selection
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isFormValid()}
            className="px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Confirm Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
