// sections/welcome/Step4.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
}

// Define proper types to fix TypeScript errors
type FormDataKeys =
  | "organizationSize"
  | "frontlineStaffTitle"
  | "seniorStaffTitle";

interface Step4FormData {
  organizationSize: string | null;
  frontlineStaffTitle: string | null;
  seniorStaffTitle: string | null;
}

export default function Step4({ onNext, onPrev }: Step4Props) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.welcome.formData[4] || {});

  const [data, setData] = useState<Step4FormData>({
    organizationSize: formData.organizationSize || null,
    frontlineStaffTitle: formData.frontlineStaffTitle || null,
    seniorStaffTitle: formData.seniorStaffTitle || null,
    ...formData,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions data matching your images
  const questions = [
    {
      id: "organizationSize" as FormDataKeys,
      label: "How big is your organisation?",
      placeholder: "Select org size",
      options: [
        "Sole Trader",
        "Small Team (1-5 staff)",
        "Corporation",
        "Not for Profit",
      ],
    },
    {
      id: "frontlineStaffTitle" as FormDataKeys,
      label: "What do you call your front-line staff?",
      placeholder: "Type or select front-line staff title",
      options: ["Workers", "Support Workers", "Clinicians"],
    },
    {
      id: "seniorStaffTitle" as FormDataKeys,
      label: "What do you call your most senior person?",
      placeholder: "Type or select senior person title",
      options: ["CEO", "Director", "Owner", "Chairperson"],
    },
  ];

  const handleAnswerChange = (questionId: FormDataKeys, value: string) => {
    const newData = {
      ...data,
      [questionId]: value,
    };

    setData(newData);

    // Auto-advance to next question after answering
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 500);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // If on first question, go back to previous step
      onPrev();
    }
  };

  const handleNext = () => {
    dispatch(completeStep(4));
    dispatch(updateFormData({ step: 4, data }));
    onNext();
  };

  const isAllQuestionsAnswered = () => {
    return questions.every((q) => data[q.id] !== null && data[q.id] !== "");
  };

  // Get previous question data with proper typing
  const getPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      return {
        label: prevQuestion.label,
        answer: data[prevQuestion.id], // This now has proper typing
        options: prevQuestion.options,
      };
    }
    return null;
  };

  // Show all questions completed - keep left-aligned layout
  if (isAllQuestionsAnswered() && currentQuestionIndex >= questions.length) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
        {/* Previous button - left aligned */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setCurrentQuestionIndex(questions.length - 1)}
            className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
          >
            <Icon name="arrow_upward" className="text-sm" />
            <span className="text-sm">Previous</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-[var(--auditly-dark-blue)] mb-8">
          Great! Your organization setup is complete.
        </h2>

        <div className="space-y-4 mb-8 max-w-2xl">
          <div className="card bg-base-100 shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-[var(--auditly-dark-blue)]">
              Organization Size:
            </h4>
            <p className="text-gray-600">{data.organizationSize}</p>
          </div>
          <div className="card bg-base-100 shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-[var(--auditly-dark-blue)]">
              Front-line Staff:
            </h4>
            <p className="text-gray-600">{data.frontlineStaffTitle}</p>
          </div>
          <div className="card bg-base-100 shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-[var(--auditly-dark-blue)]">
              Senior Person:
            </h4>
            <p className="text-gray-600">{data.seniorStaffTitle}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            iconRight={<Icon name="arrow_forward" />}
            className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const previousQuestion = getPreviousQuestion();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      {/* Show previous question if available - left aligned */}
      {previousQuestion && (
        <div className="mb-8 opacity-50">
          <h3 className="text-lg font-medium text-gray-500 mb-4">
            {previousQuestion.label}
          </h3>
          <div className="max-w-2xl">
            <select
              disabled
              className="select select-bordered w-full cursor-default"
              value={previousQuestion.answer || ""}
            >
              <option value={previousQuestion.answer || ""}>
                {previousQuestion.answer}
              </option>
            </select>
          </div>
          <p className="text-sm text-gray-400 mt-2">Your org size</p>
        </div>
      )}

      {/* Previous button - left aligned */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={handlePreviousQuestion}
          className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
        >
          <Icon
            name={currentQuestionIndex === 0 ? "arrow_back" : "arrow_upward"}
            className="text-sm"
          />
          <span className="text-sm">Previous</span>
        </button>
      </div>

      {/* Header - left aligned */}
      <h1 className="text-3xl font-bold text-[var(--auditly-dark-blue)] mb-8">
        Customise for Your Organisation
      </h1>

      {/* Current Question - left aligned */}
      <div className="max-w-2xl">
        <DropdownSelect
          label={currentQuestion.label}
          options={currentQuestion.options}
          placeholder={currentQuestion.placeholder}
          selectedValue={data[currentQuestion.id]}
          onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
        />
      </div>

      {/* Show Next button when answer is provided */}
      {data[currentQuestion.id] &&
        currentQuestionIndex === questions.length - 1 && (
          <div className="mt-8 flex justify-end max-w-2xl">
            <Button
              onClick={handleNext}
              iconRight={<Icon name="arrow_forward" />}
              className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
            >
              Next
            </Button>
          </div>
        )}
    </div>
  );
}
