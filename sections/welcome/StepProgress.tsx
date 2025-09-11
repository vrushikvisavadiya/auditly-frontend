// components/welcome/StepProgress.tsx
"use client";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import {
  setCurrentStep,
  resetWelcome,
  FinalSubmissionData,
  submitOnboardingData,
} from "@/src/redux/slices/welcomeSlice";
import { selectCurrentUser } from "@/src/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Step1 from "@/sections/welcome/Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import LeaveOnboardingModal from "@/components/ui/LeaveOnboardingModal";
import toast from "react-hot-toast";

const steps = [
  {
    id: 1,
    title: "Welcome & Basics",
    shortTitle: "Welcome",
  },
  {
    id: 2,
    title: "Organisation Discovery",
    shortTitle: "Discovery",
  },
  {
    id: 3,
    title: "Services",
    shortTitle: "Services",
  },
  {
    id: 4,
    title: "Key Roles and Structure",
    shortTitle: "Roles",
  },
  {
    id: 5,
    title: "Personalisation",
    shortTitle: "Settings",
  },
  {
    id: 6,
    title: "Review",
    shortTitle: "Review",
  },
];

export default function StepProgress() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentStep, completedSteps } = useAppSelector(
    (state) => state.welcome
  );
  const { formData } = useAppSelector((state) => state.welcome);
  const currentUser = useAppSelector(selectCurrentUser);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Set unsaved changes flag when user progresses past step 1
  useEffect(() => {
    setHasUnsavedChanges(currentStep > 1);
  }, [currentStep]);

  // Handle ONLY browser close/reload with minimal default dialog
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle ONLY browser back/forward buttons with custom modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges) {
        // Prevent the navigation
        window.history.pushState(null, "", window.location.pathname);
        // Show our custom modal
        setShowLeaveModal(true);
      }
    };

    // Push initial state
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  // Handle step changes - Allow clicking on any completed step or adjacent step
  const handleStepChange = (step: number) => {
    if (
      step === currentStep || // Same step
      step < currentStep || // Previous step
      completedSteps.includes(currentStep) || // Current step is completed
      step === currentStep + 1 || // Next step
      step === currentStep - 1 // Previous step
    ) {
      dispatch(setCurrentStep(step));
      return;
    }

    return;
  };

  // Define types for each step's data to avoid property errors
  type Step2Data = {
    providerType?: string;
    operatingStates?: { id: string }[];
    businessDescription?: string;
    registrationGroups?: { id: string }[];
  };
  type Step3Data = {
    understandServices?: boolean;
    transportParticipants?: boolean;
    supportParticipantsWithBehaviour?: boolean;
    provideFundingSupport?: boolean;
  };
  type Step4Data = {
    organizationSize?: string;
    frontlineStaffTitle?: string;
    seniorStaffTitle?: string;
  };
  type Step5Data = {
    stylePreference?: string;
    headerColor?: string;
    styleGuideFile?: File;
    styleExample?: string;
    styleDescription?: string;
  };

  const collectAllFormData = (): FinalSubmissionData => {
    const step2Data = (formData[2] || {}) as Step2Data;
    const step3Data = (formData[3] || {}) as Step3Data;
    const step4Data = (formData[4] || {}) as Step4Data;
    const step5Data = (formData[5] || {}) as Step5Data;

    return {
      // Step 2 data (Organization Discovery)
      provider_type: step2Data.providerType || "",
      states_operating:
        step2Data.operatingStates?.map((state) => parseInt(state.id)) || [],
      business_description: step2Data.businessDescription || "",
      registration_groups:
        step2Data.registrationGroups?.map((group) => parseInt(group.id)) || [],

      // Step 3 data (Services - Yes/No questions)
      administer_medications: step3Data.understandServices || false,
      handle_hazardous_waste: step3Data.transportParticipants || false,
      behaviour_support_plan:
        step3Data.supportParticipantsWithBehaviour || false,
      complex_nursing_supports: step3Data.provideFundingSupport || false,

      // Step 4 data (Key Roles and Structure)
      organization_size: step4Data.organizationSize || "SMALL TEAM (1-5 staff)",
      frontline_staff_label: step4Data.frontlineStaffTitle || "SUPPORT WORKER",
      senior_person_label: step4Data.seniorStaffTitle || "MANAGER",

      // Step 5 data (Personalisation)
      formality_level: step5Data.stylePreference || "PROFESSIONAL",
      policy_header_color: step5Data.headerColor || "#003366",
      branding_guide: step5Data.styleGuideFile
        ? URL.createObjectURL(step5Data.styleGuideFile)
        : "",
      policy_style: step5Data.styleExample || "COMPREHENSIVE",
      additional_styling: step5Data.styleDescription || "",
    };
  };

  const handleCompleted = async () => {
    try {
      const finalData = collectAllFormData();

      const orgId = currentUser?.organization_id || "temp-org-id";

      console.log("Submitting onboarding data:", finalData);
      console.log("Organization ID:", orgId);

      const result = await dispatch(
        submitOnboardingData({
          data: finalData,
          orgId,
        })
      );

      if (submitOnboardingData.fulfilled.match(result)) {
        toast.success("Organization setup completed successfully!");
        setHasUnsavedChanges(false);
        // setTimeout(() => {
        //   router.push("/");
        // }, 1500);
      } else {
        toast.error((result.payload as string) || "Setup failed");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      toast.error("An error occurred during setup");
    }
  };

  // Custom modal handlers (only for browser navigation)
  const handleLeaveAnyway = () => {
    setHasUnsavedChanges(false);
    dispatch(resetWelcome());
    setShowLeaveModal(false);
    router.push("/"); // Navigate away from onboarding
  };

  const handleStayAndFinish = () => {
    setShowLeaveModal(false);
  };

  // FIXED: Check if a step is accessible - prevents future steps from being clickable
  const isStepAccessible = (stepId: number) => {
    // Always allow current step
    if (stepId === currentStep) return true;

    // Allow clicking on previous steps only if they are completed
    if (stepId < currentStep) {
      return completedSteps.includes(stepId);
    }

    // Allow next step only if current step is completed
    if (stepId === currentStep + 1) {
      return completedSteps.includes(currentStep);
    }

    // Block all other steps
    return false;
  };

  // Render the appropriate step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={() => handleStepChange(2)} />;
      case 2:
        return (
          <Step2
            onNext={() => handleStepChange(3)}
            onPrev={() => handleStepChange(1)}
          />
        );
      case 3:
        return (
          <Step3
            onNext={() => handleStepChange(4)}
            onPrev={() => handleStepChange(2)}
          />
        );
      case 4:
        return (
          <Step4
            onNext={() => handleStepChange(5)}
            onPrev={() => handleStepChange(3)}
          />
        );
      case 5:
        return (
          <Step5
            onNext={() => handleStepChange(6)}
            onPrev={() => handleStepChange(4)}
          />
        );
      case 6:
        return (
          <Step6
            onNext={() => handleCompleted()}
            onPrev={() => handleStepChange(5)}
          />
        );
      default:
        return <Step1 onNext={() => handleStepChange(2)} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Step {currentStep} of {steps.length}
            </h3>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-600">
              {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-[#FF7F7F] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Progress */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = completedSteps.includes(step.id);
                const isPassed = currentStep > step.id;
                const isAccessible = isStepAccessible(step.id);

                return (
                  <li key={step.id} className="flex items-center">
                    {/* Step Circle */}
                    <button
                      type="button"
                      disabled={!isAccessible}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${
                          isActive
                            ? "bg-[#FF7F7F] text-white focus:ring-[#FF7F7F] hover:scale-105"
                            : isCompleted || isPassed
                            ? "bg-green-500 text-white focus:ring-green-500 hover:scale-105 cursor-pointer"
                            : isAccessible
                            ? "bg-gray-300 text-gray-600 focus:ring-gray-400 hover:scale-105 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
                      `}
                      onClick={() => isAccessible && handleStepChange(step.id)}
                      aria-label={`Go to ${step.title}`}
                    >
                      {isCompleted || isPassed ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </button>

                    {/* Step Title */}
                    <button
                      type="button"
                      disabled={!isAccessible}
                      className={`ml-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F7F] rounded px-2 py-1 ${
                        isActive
                          ? "text-[var(--auditly-dark-blue)] cursor-pointer"
                          : isCompleted || isPassed
                          ? "text-gray-700 cursor-pointer hover:text-[var(--auditly-dark-blue)]"
                          : isAccessible
                          ? "text-gray-500 cursor-pointer hover:text-[var(--auditly-dark-blue)]"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => isAccessible && handleStepChange(step.id)}
                    >
                      <div className="text-sm font-medium">{step.title}</div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Tablet Progress */}
      <div className="hidden md:block lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Step {currentStep} of {steps.length}
            </h3>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-600">
              {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Horizontal Step Indicators */}
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isPassed = currentStep > step.id;
            const isAccessible = isStepAccessible(step.id);

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isAccessible}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    isActive
                      ? "bg-[#FF7F7F] text-white focus:ring-[#FF7F7F]"
                      : isCompleted || isPassed
                      ? "bg-green-500 text-white focus:ring-green-500 cursor-pointer"
                      : isAccessible
                      ? "bg-gray-300 text-gray-600 focus:ring-gray-400 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                onClick={() => isAccessible && handleStepChange(step.id)}
                aria-label={`Go to ${step.title}`}
              >
                {isCompleted || isPassed ? "✓" : step.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white">{renderStepContent()}</div>

      {/* Custom Leave Onboarding Modal - ONLY for browser navigation */}
      <LeaveOnboardingModal
        isOpen={showLeaveModal}
        onLeaveAnyway={handleLeaveAnyway}
        onStayAndFinish={handleStayAndFinish}
      />
    </div>
  );
}
