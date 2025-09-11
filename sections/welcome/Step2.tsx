// sections/welcome/Step2.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import CustomMultiSelect, {
  OptionType,
} from "@/components/ui/CustomMultiSelect";
import LoadingDots from "@/components/ui/LoadingDots";
import {
  registrationGroupOptions,
  stateOptions,
  suggestedRegistrationGroups,
} from "@/src/constants/dropdownOptions";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Step management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestionConfirmation, setShowSuggestionConfirmation] =
    useState(false);

  const questions = [
    "providerType",
    "operatingStates",
    "businessDescription",
    "suggestions",
    "registrationGroups",
  ];

  // Auto-advance to next question with loading
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    }
  };

  // Go to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowSuggestionConfirmation(false);
    } else {
      onPrev();
    }
  };

  // Check if current question is valid
  const isCurrentQuestionValid = () => {
    const currentQuestion = questions[currentQuestionIndex];
    switch (currentQuestion) {
      case "providerType":
        return data.providerType && data.providerType.trim() !== "";
      case "operatingStates":
        return data.operatingStates && data.operatingStates.length > 0;
      case "businessDescription":
        return (
          data.businessDescription && data.businessDescription.trim() !== ""
        );
      case "suggestions":
        return showSuggestionConfirmation;
      case "registrationGroups":
        return data.registrationGroups && data.registrationGroups.length > 0;
      default:
        return false;
    }
  };

  const handleProviderTypeChange = (type: string) => {
    setData({ ...data, providerType: type });
  };

  const handleConfirmSuggestions = () => {
    setShowSuggestionConfirmation(true);
    goToNextQuestion();
  };

  const handleEditSuggestions = () => {
    setCurrentQuestionIndex(2); // Go back to business description
    setShowSuggestionConfirmation(false);
  };

  const handleNext = async () => {
    try {
      await dispatch(completeStep(2));
      await dispatch(
        updateFormData({
          step: 2,
          data: {
            providerType: data.providerType,
            operatingStates: data.operatingStates,
            businessDescription: data.businessDescription,
            registrationGroups: data.registrationGroups,
          },
        })
      );
      onNext();
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      {/* Previous Button - Always visible */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <button
          onClick={goToPreviousQuestion}
          className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
          type="button"
        >
          <Icon name="arrow_back" className="text-sm" />
          <span className="text-sm">Previous</span>
        </button>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center py-12"
          >
            <LoadingDots />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Question 1: Provider Type */}
            {currentQuestion === "providerType" && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--auditly-dark-blue)] mb-3">
                  Organisation Discovery
                </h1>
                <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-6">
                  Are you an NDIS provider or Home Care provider?
                </h3>
                <div className="space-y-3 max-w-2xl">
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

                {isCurrentQuestionValid() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={goToNextQuestion}
                      className="px-6 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Question 2: Operating States */}
            {currentQuestion === "operatingStates" && (
              <div>
                <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-2">
                  What state or territory do you operate in? (You can choose
                  more than one)
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  This helps me check which state-specific policies you need.
                </p>
                <CustomMultiSelect
                  options={stateOptions}
                  selectedValues={
                    Array.isArray(data.operatingStates)
                      ? data.operatingStates
                      : []
                  }
                  onChange={(selectedList) => {
                    setData({ ...data, operatingStates: selectedList });
                  }}
                  placeholder="Type or select territories"
                />

                {isCurrentQuestionValid() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={goToNextQuestion}
                      className="px-6 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Question 3: Business Description */}
            {currentQuestion === "businessDescription" && (
              <div>
                <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-2">
                  Perfect! Now tell me a bit about your business. What kind of
                  services do you provide? Write in your own words.
                </h3>
                <p className="text-sm text-[var(--auditly-light-blue)] mb-6">
                  (Use simple words; I&apos;ll detect your registration groups
                  for you.)
                </p>
                <textarea
                  value={data.businessDescription || ""}
                  onChange={(e) => {
                    setData({ ...data, businessDescription: e.target.value });
                  }}
                  placeholder="We're a small family business. I'm an occupational therapist, and we also help with support coordination for our NDIS clients."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-base leading-relaxed"
                />

                {isCurrentQuestionValid() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={goToNextQuestion}
                      className="px-6 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Question 4: Suggested Registration Groups */}
            {currentQuestion === "suggestions" && (
              <div>
                <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-4">
                  Thanks! Based on what you shared, I think these registration
                  groups fit your business:
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {suggestedRegistrationGroups.map((reg, index) => (
                    <motion.div
                      key={reg.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="inline-flex items-center px-3 py-2 bg-[var(--auditly-orange)]/20 text-black text-sm rounded-md"
                    >
                      {reg.name}
                    </motion.div>
                  ))}
                </div>

                <h4 className="text-base font-semibold text-[var(--auditly-dark-blue)] mb-4">
                  Do these registration groups describe your business?
                </h4>
                <div className="flex gap-4">
                  <Button
                    onClick={handleEditSuggestions}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    onClick={handleConfirmSuggestions}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    ✅ Yes, looks good
                  </Button>
                </div>
              </div>
            )}

            {/* Question 5: Registration Groups Selection */}
            {currentQuestion === "registrationGroups" && (
              <div>
                <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-6">
                  Select Registration Groups:
                </h3>
                <CustomMultiSelect
                  options={registrationGroupOptions}
                  selectedValues={
                    Array.isArray(data.registrationGroups)
                      ? data.registrationGroups
                      : []
                  }
                  onChange={(selectedList) => {
                    setData({ ...data, registrationGroups: selectedList });
                  }}
                  placeholder="Search and select registration groups..."
                />

                {isCurrentQuestionValid() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-gray-200"
                  >
                    <h4 className="font-semibold text-[var(--auditly-dark-blue)] text-base mb-4">
                      Please review your selection before continuing
                    </h4>
                    <div className="flex justify-start gap-4 items-center">
                      <Button
                        onClick={goToPreviousQuestion}
                        className="px-6 py-3 bg-[var(--auditly-orange)] text-white hover:bg-[var(--auditly-orange)]/90 transition-colors"
                      >
                        ❌ Discard Selection
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
                      >
                        ✅ Confirm Selection
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
