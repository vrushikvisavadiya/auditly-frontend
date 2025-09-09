// components/welcome/StepProgress.tsx
import { useAppSelector } from "@/src/redux/hooks";

const steps = [
  { id: 1, title: "Welcome & Basics", description: "Getting started" },
  { id: 2, title: "Organisation Discovery", description: "Your business info" },
  { id: 3, title: "Services", description: "What you offer" },
  { id: 4, title: "Key Roles and Structure", description: "Team setup" },
  { id: 5, title: "Personalisation", description: "Customize settings" },
  { id: 6, title: "Review", description: "Final overview" },
];

export default function StepProgress() {
  const { currentStep, completedSteps } = useAppSelector(
    (state) => state.welcome
  );

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
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
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      ${
                        isActive
                          ? "bg-[#FF7F7F] text-white"
                          : isCompleted || isPassed
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }
                      transition-all duration-200
                    `}
                  >
                    {isCompleted || isPassed ? "✓" : step.id}
                  </div>

                  {/* Step Title */}
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-[var(--auditly-dark-blue)]"
                          : isCompleted || isPassed
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
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
  );
}
