// sections/welcome/Step6.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

interface Step6Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step6({ onNext, onPrev }: Step6Props) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.welcome);

  const [isGenerating, setIsGenerating] = useState(false);

  // Extract data from all previous steps
  const step2Data = formData[2] || {};
  const step3Data = formData[3] || {};
  const step4Data = formData[4] || {};
  const step5Data = formData[5] || {};

  const handleReviewAgain = () => {
    onPrev();
  };

  const handleGeneratePolicies = async () => {
    setIsGenerating(true);

    // Simulate API call or processing
    setTimeout(() => {
      dispatch(completeStep(6));
      dispatch(
        updateFormData({
          step: 6,
          data: {
            reviewCompleted: true,
            generationStarted: true,
            completedAt: new Date().toISOString(),
          },
        })
      );
      setIsGenerating(false);
      onNext();
    }, 2000);
  };

  // Format states for display
  const formatStates = (states: any[]) => {
    if (!Array.isArray(states)) return "Not specified";
    return states.map((state) => state.name || state).join(", ");
  };

  // Format registration groups for display
  const formatRegistrationGroups = (groups: any[]) => {
    if (!Array.isArray(groups)) return "Not specified";
    return groups.map((group) => group.name || group).join(", ");
  };

  // Generate policies list based on selections
  const generatePoliciesList = () => {
    const policies = [];

    // Add core policies based on step 3 responses
    if (step3Data.understandServices) {
      policies.push("Core 4.3 - Medication");
    }
    if (step3Data.transportParticipants) {
      policies.push("Core 4.4 - Waste Management");
    }
    if (step3Data.supportParticipantsWithBehaviour) {
      policies.push("Module 2a - Behaviour Support");
    }

    return policies.length > 0
      ? policies.join(", ")
      : "Standard policy package";
  };

  // Get style preference display text
  const getStyleText = () => {
    const style = step5Data?.stylePreference;
    switch (style) {
      case "government":
        return "Government-style (very formal)";
      case "professional":
        return "Professional but clear";
      case "friendly":
        return "Friendly and easy to read";
      default:
        return "Not specified";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
    >
      {/* Previous button */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
          type="button"
        >
          <Icon name="arrow_back" className="text-sm" />
          <span className="text-sm">Previous</span>
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[var(--auditly-dark-blue)] mb-2 flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          Awesome! Here&apos;s your setup summary:
        </h1>
      </motion.div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8"
      >
        {/* Header Row */}
        <div className="bg-[var(--auditly-orange)] text-white px-6 py-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-semibold">Category</div>
            <div className="font-semibold">Your selection</div>
          </div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-gray-200">
          {/* Provider Type */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">Provider Type</div>
              <div className="text-gray-700">
                {step2Data?.providerType || "Not specified"}
              </div>
            </div>
          </div>

          {/* States */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">
                States you operate in
              </div>
              <div className="text-gray-700">
                {formatStates(step2Data?.operatingStates)}
              </div>
            </div>
          </div>

          {/* Registration Groups */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">
                Registration Groups
              </div>
              <div className="text-gray-700">
                {formatRegistrationGroups(step2Data?.registrationGroups)}
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">Policies</div>
              <div className="text-gray-700">{generatePoliciesList()}</div>
            </div>
          </div>

          {/* Tone */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">Tone</div>
              <div className="text-gray-700">{getStyleText()}</div>
            </div>
          </div>

          {/* Senior Position Title */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">
                Senior Position Title
              </div>
              <div className="text-gray-700">
                {step4Data.seniorStaffTitle || "Not specified"}
              </div>
            </div>
          </div>

          {/* Frontline Staff Title */}
          <div className="px-6 py-4 border-b-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium text-gray-900">
                Frontline Staff Title
              </div>
              <div className="text-gray-700">
                {step4Data.frontlineStaffTitle || "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Final Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold text-[var(--auditly-dark-blue)] mb-6">
          Does this look right?
        </h3>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleReviewAgain}
            className="px-6 py-3 btn-orange text-white hover:bg-[var(--auditly-orange)]/90 transition-colors"
          >
            🔍 Review again
          </Button>

          <Button
            onClick={handleGeneratePolicies}
            disabled={isGenerating}
            className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>✅ Yes, generate my policies</>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Additional Info */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <Icon name="info" className="text-blue-500 text-lg mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              What happens next?
            </h4>
            <p className="text-blue-700 text-sm">
              We&apos;ll generate your customized policy documents based on your
              selections. This process typically takes 2-3 minutes. You&apos;ll
              be able to review, edit, and download your policies once
              they&apos;re ready.
            </p>
          </div>
        </div>
      </motion.div> */}
    </motion.div>
  );
}
