"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

// Custom Toggle Button Component for Yes/No
interface ToggleButtonProps {
  question: string;
  description?: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  isFirstQuestion?: boolean;
  data?: any;
  previousQuestion?: {
    text: string;
    description?: string;
    answer: boolean | null;
  };
}

function YesNoToggle({
  question,
  description,
  value,
  onChange,
  onPrevious,
  showPrevious,
  isFirstQuestion,
  previousQuestion,
  data,
}: ToggleButtonProps) {
  return (
    <div className="pt-10">
      {/* Show previous question if available */}
      {previousQuestion && (
        <div className="mb-8 opacity-50">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            {previousQuestion.text}
          </h3>
          {previousQuestion.description && (
            <p className="text-sm text-gray-400 mb-4">
              {previousQuestion.description}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              disabled
              className={`px-6 py-2 rounded-lg font-semibold ${
                previousQuestion.answer === false
                  ? "btn-orange text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              ❌ No
            </button>
            <button
              type="button"
              disabled
              className={`px-6 py-2 rounded-lg font-semibold ${
                previousQuestion.answer === true
                  ? "btn-dark-blue text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              ✅ Yes
            </button>
          </div>
        </div>
      )}

      {showPrevious && onPrevious && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
          >
            <Icon
              name={isFirstQuestion ? "arrow_back" : "arrow_upward"}
              className="text-sm"
            />
            <span className="text-sm">Previous</span>
          </button>
        </div>
      )}

      {isFirstQuestion && (
        <h3 className="text-xl font-medium text-[var(--auditly-dark-blue)] mb-2">
          {data?.text}
        </h3>
      )}

      {/* Current Question */}
      <h3 className="text-lg font-medium text-[var(--auditly-dark-blue)] mb-2">
        {question}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            value === false
              ? "btn-orange text-white focus:ring-orange-500"
              : "btn-orange text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
          }`}
        >
          ❌ No
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            value === true
              ? "btn-dark-blue text-white focus:ring-blue-500"
              : "btn-dark-blue text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
          }`}
        >
          ✅ Yes
        </button>
      </div>
    </div>
  );
}

export default function Step3({ onNext, onPrev }: Step3Props) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.welcome.formData[3] || {});

  type DataType = {
    [key: string]: boolean | null;
    understandServices: boolean | null;
    transportParticipants: boolean | null;
    supportParticipantsWithBehaviour: boolean | null;
    provideFundingSupport: boolean | null;
  };

  const [data, setData] = useState<DataType>({
    understandServices: formData.understandServices || null,
    transportParticipants: formData.transportParticipants || null,
    supportParticipantsWithBehaviour:
      formData.supportParticipantsWithBehaviour || null,
    provideFundingSupport: formData.provideFundingSupport || null,
    ...formData,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Questions data with proper structure
  const questions = [
    {
      id: "understandServices",
      text: "Help Us Understand Your Services",
      question: "Do you administer medications to your participants?",
      description: "Includes tablets, injections, or creams.",
    },
    {
      id: "transportParticipants",
      text: "Do you handle hazardous waste like dirty gloves, bodily fluids, or cleaning chemicals?",
      question:
        "Do you handle hazardous waste like dirty gloves, bodily fluids, or cleaning chemicals?",
    },
    {
      id: "supportParticipantsWithBehaviour",
      text: "Do you support participants who have a Behaviour Support Plan in place?",
      question:
        "Do you support participants who have a Behaviour Support Plan in place?",
    },
    {
      id: "provideFundingSupport",
      text: "Do you provide complex nursing supports (PEG feeding, bowel care, etc.)?",
      question:
        "Do you provide complex nursing supports (PEG feeding, bowel care, etc.)?",
    },
  ];

  const handleAnswerChange = (questionId: string, value: boolean) => {
    const newData = {
      ...data,
      [questionId]: value,
    };

    setData(newData);

    // Auto-advance to next question after answering
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Show summary after all questions are answered
        setShowSummary(true);
      }
    }, 500);
  };

  const handlePreviousQuestion = () => {
    console.log("Previous clicked, current index:", currentQuestionIndex);

    if (showSummary) {
      // From summary, go back to last question
      console.log("Going back from summary to last question");
      setShowSummary(false);
      setCurrentQuestionIndex(questions.length - 1);
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // If on first question, go back to previous step
      onPrev();
    }
  };

  // FIXED: Handle previous from summary
  const handlePreviousFromSummary = () => {
    console.log("Going back from summary to last question");
    setShowSummary(false);
    // Use setTimeout to ensure state update processes
    setTimeout(() => {
      setCurrentQuestionIndex(questions.length - 1);
    }, 0);
  };

  const handleNext = () => {
    dispatch(completeStep(3));
    dispatch(updateFormData({ step: 3, data }));
    onNext();
  };

  const isAllQuestionsAnswered = () => {
    return questions.every((q) => data[q.id] !== null);
  };

  const getPolicyPackages = () => {
    return [
      {
        id: "core-4.3",
        name: "Core 4.3 – Medication",
        selected: true,
      },
      {
        id: "core-4.4",
        name: "Core 4.4 – Waste Management",
        selected: true,
      },
      {
        id: "module-2a",
        name: "Module 2a – Behaviour Support",
        selected: true,
      },
    ];
  };

  // Get previous question data
  const getPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      return {
        text: prevQuestion.question,
        description: prevQuestion.description,
        answer: data[prevQuestion.id],
      };
    }
    return null;
  };

  // Show policy package summary after all questions are answered
  if (
    showSummary ||
    (isAllQuestionsAnswered() && currentQuestionIndex >= questions.length)
  ) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
        {/* Policy Package Summary */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={handlePreviousFromSummary}
              className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
              type="button"
            >
              <Icon name="arrow_upward" className="text-sm" />
              <span className="text-sm">Previous</span>
            </button>
          </div>

          <h3 className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-6">
            Your Policy Package so far:
          </h3>

          <div className="space-y-4">
            {getPolicyPackages().map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Icon name="check" className="text-white text-xs" />
                </div>
                <span className="text-gray-700 text-base">{pkg.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              iconRight={<Icon name="arrow_forward" />}
              className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const prevQ = getPreviousQuestion() ?? undefined;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      <div className="space-y-6">
        <YesNoToggle
          key={currentQuestionIndex}
          data={currentQuestion}
          question={currentQuestion.question}
          description={currentQuestion.description}
          value={data[currentQuestion.id]}
          onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          onPrevious={handlePreviousQuestion}
          showPrevious={true}
          isFirstQuestion={currentQuestionIndex === 0}
          previousQuestion={prevQ}
        />
      </div>
    </div>
  );
}
