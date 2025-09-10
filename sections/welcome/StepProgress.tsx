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
// Import other step components as you create them
// import Step2 from "@/sections/welcome/Step2";
// import Step3 from "@/sections/welcome/Step3";
// import Step4 from "@/sections/welcome/Step4";
// import Step5 from "@/sections/welcome/Step5";
// import Step6 from "@/sections/welcome/Step6";

const steps = [
  { id: 1, title: "Welcome & Basics", description: "Getting started" },
  { id: 2, title: "Organisation Discovery", description: "Your business info" },
  { id: 3, title: "Services", description: "What you offer" },
  { id: 4, title: "Key Roles and Structure", description: "Team setup" },
  { id: 5, title: "Personalisation", description: "Customize settings" },
  { id: 6, title: "Review", description: "Final overview" },
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
      // return (
      //   <div className="text-center py-20">
      //     <h2 className="text-2xl font-semibold text-gray-600 mb-4">
      //       Step 3: Services
      //     </h2>
      //     <p className="text-gray-500">Coming Soon...</p>
      //   </div>
      // );
      case 4:
        return (
          <Step4
            onNext={() => handleStepChange(4)}
            onPrev={() => handleStepChange(2)}
          />
        );

      case 5:
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
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Step 6: Review
            </h2>
            <p className="text-gray-500">Coming Soon...</p>
          </div>
        );
      default:
        return <Step1 onNext={() => handleStepChange(2)} />;
    }
  };

  return (
    <div>
      {/* Step Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isPassed = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle and Content */}
                  <div className="flex items-center">
                    {/* Step Number Circle */}
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer
                        ${
                          isActive
                            ? "bg-[#FF7F7F] text-white"
                            : isCompleted || isPassed
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600 font-semibold"
                        }
                        transition-all duration-200 hover:scale-105
                      `}
                      onClick={() => handleStepChange(step.id)}
                    >
                      {isCompleted || isPassed ? "✓" : step.id}
                    </div>

                    {/* Step Title */}
                    <div className="ml-3">
                      <div
                        className={`text-sm font-medium cursor-pointer hover:text-[var(--auditly-dark-blue)] transition-colors ${
                          isActive
                            ? "text-[var(--auditly-dark-blue)]"
                            : isCompleted || isPassed
                            ? "text-gray-700"
                            : "text-gray-500"
                        }`}
                        onClick={() => handleStepChange(step.id)}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className="h-px bg-gray-200 relative">
                        <div
                          className={`h-full transition-all duration-300 ${
                            currentStep > step.id
                              ? "bg-green-500"
                              : currentStep === step.id
                              ? "bg-[#FF7F7F]"
                              : "bg-gray-200"
                          }`}
                          style={{
                            width:
                              currentStep > step.id
                                ? "100%"
                                : currentStep === step.id
                                ? "50%"
                                : "0%",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white min-h-[calc(100vh-180px)]">
        {renderStepContent()}
      </div>
    </div>
  );
}
