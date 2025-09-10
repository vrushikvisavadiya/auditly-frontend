// components/welcome/StepProgress.tsx
"use client";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { setCurrentStep } from "@/src/redux/slices/welcomeSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Step1 from "@/sections/welcome/Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step6 from "./Step6";
// import Step5 from "./Step5";

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
  const searchParams = useSearchParams();
  const { currentStep, completedSteps } = useAppSelector(
    (state) => state.welcome
  );

  // Sync URL params with Redux state
  useEffect(() => {
    const step = searchParams.get("step");
    const stepNumber = step ? parseInt(step) : 1;

    if (stepNumber >= 1 && stepNumber <= 6 && stepNumber !== currentStep) {
      dispatch(setCurrentStep(stepNumber));
    }
  }, [searchParams, dispatch, currentStep]);

  // Update URL when step changes
  const handleStepChange = (step: number) => {
    dispatch(setCurrentStep(step));
    router.push(`/welcome?step=${step}`);
  };

  const handleCompleted = () => {
    console.log("handleCompleted");
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
        // return (
        //   <Step5
        //     onNext={() => handleStepChange(5)}
        //     onPrev={() => handleStepChange(3)}
        //   />
        // );
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Step 5: Personalisation
            </h2>
            <p className="text-gray-500">Coming Soon...</p>
          </div>
        );
      case 6:
        return (
          <Step6
            onNext={() => handleCompleted()}
            onPrev={() => handleStepChange(3)}
          />
        );
      default:
        return <Step1 onNext={() => handleStepChange(2)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Side by Side */}
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

      {/* Desktop Step Progress - Circle First, then Title */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = completedSteps.includes(step.id);
                const isPassed = currentStep > step.id;

                return (
                  <li
                    key={step.id}
                    className="flex items-center cursor-pointer"
                  >
                    {/* Step Circle */}
                    <button
                      type="button"
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${
                          isActive
                            ? "bg-[#FF7F7F] text-white focus:ring-[#FF7F7F]"
                            : isCompleted || isPassed
                            ? "bg-green-500 text-white focus:ring-green-500"
                            : "bg-gray-300 text-gray-600 focus:ring-gray-400"
                        }
                      `}
                      onClick={() => handleStepChange(step.id)}
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

                    {/* Step Title - Right next to circle */}
                    <button
                      type="button"
                      className={`ml-3 text-left cursor-pointer hover:text-[var(--auditly-dark-blue)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F7F] rounded px-2 py-1 ${
                        isActive
                          ? "text-[var(--auditly-dark-blue)]"
                          : isCompleted || isPassed
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleStepChange(step.id)}
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

      {/* Tablet Progress (md to lg) - Side by Side Header */}
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

            return (
              <button
                key={step.id}
                type="button"
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    isActive
                      ? "bg-[#FF7F7F] text-white focus:ring-[#FF7F7F]"
                      : isCompleted || isPassed
                      ? "bg-green-500 text-white focus:ring-green-500"
                      : "bg-gray-300 text-gray-600 focus:ring-gray-400"
                  }
                `}
                onClick={() => handleStepChange(step.id)}
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
    </div>
  );
}
