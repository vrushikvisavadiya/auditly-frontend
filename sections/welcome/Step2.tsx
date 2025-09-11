// sections/welcome/Step2.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import CustomMultiSelect, {
  OptionType,
} from "@/components/ui/CustomMultiSelect";
import LoadingDots from "@/components/ui/LoadingDots";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSelectedRegistrationIds,
  getSelectedStateIds,
} from "@/src/utils/organizationHelpers";
import {
  useRegistrationGroups,
  useStates,
  useMatchGroups,
} from "@/src/hooks/useOrganizationData";

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

interface PreviousQuestion {
  question: string;
  description?: string;
  answer: any;
  type: "radio" | "multiselect" | "textarea" | "suggestions";
}

// Component to display previous question summary
function PreviousQuestionSummary({ question }: { question: PreviousQuestion }) {
  return (
    <div className="mb-8 pb-6 border-b border-gray-200 opacity-60">
      <h3 className="text-lg font-medium text-gray-500 mb-2">
        {question.question}
      </h3>
      {question.description && (
        <p className="text-sm text-gray-400 mb-4">{question.description}</p>
      )}

      {/* Display answer based on type */}
      {question.type === "radio" && question.answer && (
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            className={`px-4 py-2 rounded-lg font-semibold ${
              question.answer === "NDIS"
                ? "bg-[var(--auditly-orange)] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            NDIS
          </button>
          <button
            type="button"
            disabled
            className={`px-4 py-2 rounded-lg font-semibold ${
              question.answer === "Home Care"
                ? "bg-[var(--auditly-orange)] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Home Care
          </button>
        </div>
      )}

      {question.type === "multiselect" &&
        question.answer &&
        question.answer.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {question.answer.map((item: OptionType, index: number) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-md"
              >
                {item.name}
              </div>
            ))}
          </div>
        )}

      {question.type === "textarea" && question.answer && (
        <div className="p-3 bg-gray-100 rounded-lg text-gray-600 text-sm">
          {question.answer.substring(0, 100)}...
        </div>
      )}

      {question.type === "suggestions" && question.answer && (
        <div className="flex flex-wrap gap-2">
          {/* This will be populated dynamically from API */}
        </div>
      )}
    </div>
  );
}

export default function Step2({ onNext, onPrev }: Step2Props) {
  const dispatch = useAppDispatch();
  const formData: Step2FormData = useAppSelector(
    (state) => state.welcome.formData[2] || {}
  );

  const { states, loading: statesLoading, error: statesError } = useStates();
  const {
    registrationGroups,
    loading: groupsLoading,
    error: groupsError,
  } = useRegistrationGroups();

  // New hook for matching groups
  const {
    matchedGroups,
    loading: matchingLoading,
    error: matchingError,
    matchGroups,
  } = useMatchGroups();

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
  const [showRegistrationSelect, setShowRegistrationSelect] = useState(false);

  const [selectedStates, setSelectedStates] = useState<OptionType[]>(
    formData.operatingStates || []
  );
  const [selectedGroups, setSelectedGroups] = useState<OptionType[]>(
    formData.registrationGroups || []
  );

  const questions = [
    {
      id: "providerType",
      question: "Are you an NDIS provider or Home Care provider?",
      type: "radio" as const,
    },
    {
      id: "operatingStates",
      question:
        "What state or territory do you operate in? (You can choose more than one)",
      description:
        "This helps me check which state-specific policies you need.",
      type: "multiselect" as const,
    },
    {
      id: "businessDescription",
      question:
        "Perfect! Now tell me a bit about your business. What kind of services do you provide? Write in your own words.",
      description:
        "(Use simple words; I'll detect your registration groups for you.)",
      type: "textarea" as const,
    },
    {
      id: "suggestions",
      question:
        "Thanks! Based on what you shared, I think these registration groups fit your business:",
      type: "suggestions" as const,
    },
    {
      id: "registrationGroups",
      question: "Select Registration Groups:",
      type: "multiselect" as const,
    },
  ];

  // Auto-advance to next question with loading and API call for business description
  const goToNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsLoading(true);

      // If moving from business description, call match groups API
      if (currentQuestionIndex === 2 && data.businessDescription) {
        try {
          await matchGroups(data.businessDescription);
          // Set matched groups as selected groups
          setTimeout(() => {
            setSelectedGroups(matchedGroups);
            setIsLoading(false);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }, 1500);
        } catch (error) {
          console.error("Error matching groups:", error);
          setIsLoading(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 1500);
      }
    }
  };

  // Go to previous question
  const goToPreviousQuestion = () => {
    if (showRegistrationSelect) {
      setShowRegistrationSelect(false);
      setCurrentQuestionIndex(3);
      // Reset to matched groups when going back from edit
      setSelectedGroups(matchedGroups);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowSuggestionConfirmation(false);
    } else {
      onPrev();
    }
  };

  // Check if current question is valid
  const isCurrentQuestionValid = () => {
    const currentQuestion = questions[currentQuestionIndex];
    switch (currentQuestion.id) {
      case "providerType":
        return data.providerType && data.providerType.trim() !== "";
      case "operatingStates":
        return selectedStates && selectedStates.length > 0;
      case "businessDescription":
        return (
          data.businessDescription && data.businessDescription.trim() !== ""
        );
      case "suggestions":
        return showSuggestionConfirmation;
      case "registrationGroups":
        return selectedGroups && selectedGroups.length > 0;
      default:
        return false;
    }
  };

  const handleProviderTypeChange = (type: string) => {
    setData({ ...data, providerType: type });
  };

  // Handle "Yes, looks good" - proceed to next step
  const handleConfirmSuggestions = () => {
    setShowSuggestionConfirmation(true);
    handleNext(); // Directly call handleNext instead of onNext
  };

  // Handle "Edit" - show registration selection and reset selectedGroups
  const handleEditSuggestions = () => {
    setShowRegistrationSelect(true);
    setCurrentQuestionIndex(4);
    // Reset selected groups to empty for manual selection
    setSelectedGroups([]);
  };

  const handleNext = async () => {
    const stateIds = getSelectedStateIds(selectedStates);
    const registrationGroupIds = getSelectedRegistrationIds(selectedGroups);

    console.log("State IDs for API:", stateIds);
    console.log("Registration Group IDs for API:", registrationGroupIds);

    try {
      dispatch(completeStep(2));
      dispatch(
        updateFormData({
          step: 2,
          data: {
            providerType: data.providerType,
            operatingStates: selectedStates,
            businessDescription: data.businessDescription,
            registrationGroups: selectedGroups,
          },
        })
      );
      onNext();
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  };

  // Get previous question data
  const getPreviousQuestion = (): PreviousQuestion | null => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      let answer: any = null;

      switch (prevQuestion.id) {
        case "providerType":
          answer = data.providerType;
          break;
        case "operatingStates":
          answer = selectedStates;
          break;
        case "businessDescription":
          answer = data.businessDescription;
          break;
        case "suggestions":
          answer = matchedGroups;
          break;
        case "registrationGroups":
          answer = selectedGroups;
          break;
      }

      return {
        question: prevQuestion.question,
        description: prevQuestion.description,
        answer,
        type: prevQuestion.type,
      };
    }
    return null;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const areInputsDisabled = showRegistrationSelect;
  const previousQuestion = getPreviousQuestion();

  if (statesLoading || groupsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingDots />
      </div>
    );
  }

  if (statesError) {
    return (
      <div className="text-red-600">Error loading states: {statesError}</div>
    );
  }

  if (groupsError) {
    return (
      <div className="text-red-600">
        Error loading registration groups: {groupsError}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      {/* Previous Question Summary */}
      {previousQuestion && (
        <PreviousQuestionSummary question={previousQuestion} />
      )}

      {/* Loading State */}
      <AnimatePresence>
        {(isLoading || matchingLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center py-12"
          >
            <LoadingDots />
            {matchingLoading && (
              <p className="ml-4 text-gray-600">
                Analyzing your business description...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {matchingError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {matchingError}
        </div>
      )}

      {/* Question Content */}
      <AnimatePresence mode="wait">
        {!isLoading && !matchingLoading && (
          <>
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
                <Icon
                  name={
                    currentQuestionIndex === 0 ? "arrow_back" : "arrow_upward"
                  }
                  className="text-sm"
                />
                <span className="text-sm">Previous</span>
              </button>
            </motion.div>

            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Question 1: Provider Type */}
              {currentQuestion.id === "providerType" && (
                <div>
                  {currentQuestionIndex === 0 && (
                    <h1 className="text-3xl font-bold text-[var(--auditly-dark-blue)] mb-3">
                      Organisation Discovery
                    </h1>
                  )}

                  <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-6">
                    {currentQuestion.question}
                  </h3>
                  <div className="space-y-3 max-w-2xl">
                    <label
                      className={`flex items-center p-4 border-2 border-gray-200 rounded-lg transition-colors ${
                        areInputsDisabled
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:border-[var(--auditly-orange)]"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="providerType"
                          value="NDIS"
                          checked={data.providerType === "NDIS"}
                          onChange={() => handleProviderTypeChange("NDIS")}
                          disabled={areInputsDisabled}
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
                    <label
                      className={`flex items-center p-4 border-2 border-gray-200 rounded-lg transition-colors ${
                        areInputsDisabled
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:border-[var(--auditly-orange)]"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="providerType"
                          value="HOME_CARE"
                          checked={data.providerType === "HOME_CARE"}
                          onChange={() => handleProviderTypeChange("HOME_CARE")}
                          disabled={areInputsDisabled}
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

                  {isCurrentQuestionValid() && !areInputsDisabled && (
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
              {currentQuestion.id === "operatingStates" && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-2">
                    {currentQuestion.question}
                  </h3>
                  {currentQuestion.description && (
                    <p className="text-gray-600 text-sm mb-6">
                      {currentQuestion.description}
                    </p>
                  )}
                  <div
                    className={
                      areInputsDisabled ? "opacity-60 pointer-events-none" : ""
                    }
                  >
                    <CustomMultiSelect
                      options={states}
                      selectedValues={selectedStates}
                      onChange={setSelectedStates}
                      placeholder="Type or select territories"
                    />
                  </div>

                  {selectedStates.length > 0 && (
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
              {currentQuestion.id === "businessDescription" && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-2">
                    {currentQuestion.question}
                  </h3>
                  {currentQuestion.description && (
                    <p className="text-sm text-[var(--auditly-light-blue)] mb-6">
                      {currentQuestion.description}
                    </p>
                  )}
                  <textarea
                    value={data.businessDescription || ""}
                    onChange={(e) => {
                      if (!areInputsDisabled) {
                        setData({
                          ...data,
                          businessDescription: e.target.value,
                        });
                      }
                    }}
                    disabled={areInputsDisabled}
                    placeholder="We're a small family business. I'm an occupational therapist, and we also help with support coordination for our NDIS clients."
                    className={`w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-base leading-relaxed ${
                      areInputsDisabled ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />

                  {isCurrentQuestionValid() && !areInputsDisabled && (
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
              {currentQuestion.id === "suggestions" &&
                !showRegistrationSelect && (
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-4">
                      {currentQuestion.question}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {matchedGroups.map((reg, index) => (
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
              {(currentQuestion.id === "registrationGroups" ||
                showRegistrationSelect) && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-6">
                    {currentQuestion.question}
                  </h3>
                  <CustomMultiSelect
                    options={registrationGroups}
                    selectedValues={selectedGroups}
                    onChange={setSelectedGroups}
                    placeholder="Search and select registration groups..."
                  />

                  {selectedGroups && selectedGroups.length > 0 && (
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
