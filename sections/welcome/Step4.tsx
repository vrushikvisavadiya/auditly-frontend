// sections/welcome/Step4.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";
import { organizationOptions } from "@/src/constants/dropdownOptions";
import { selectStyles } from "@/src/styles/selectStyles";

// Define SelectOptionType for react-select options
interface SelectOptionType {
  label: string;
  value: string;
}

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
}

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
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions configuration
  const questions = [
    {
      id: "organizationSize" as keyof Step4FormData,
      label: "How big is your organisation?",
      placeholder: "Select organization size",
      options: organizationOptions.organizationSize,
    },
    {
      id: "frontlineStaffTitle" as keyof Step4FormData,
      label: "What do you call your front-line staff?",
      placeholder: "Type or select front-line staff title",
      options: organizationOptions.frontlineStaffTitle,
    },
    {
      id: "seniorStaffTitle" as keyof Step4FormData,
      label: "What do you call your most senior person?",
      placeholder: "Type or select senior person title",
      options: organizationOptions.seniorStaffTitle,
    },
  ];

  const handleAnswerChange = (
    questionId: keyof Step4FormData,
    selectedOption: SelectOptionType | null
  ) => {
    const newData = {
      ...data,
      [questionId]: selectedOption?.label || null,
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

  // Get previous question data
  const getPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      return {
        label: prevQuestion.label,
        answer: data[prevQuestion.id],
        options: prevQuestion.options,
      };
    }
    return null;
  };

  // Show summary after all questions are answered
  if (isAllQuestionsAnswered() && currentQuestionIndex >= questions.length) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
      >
        {/* Previous button */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setCurrentQuestionIndex(questions.length - 1)}
            className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
            type="button"
          >
            <Icon name="arrow_upward" className="text-sm" />
            <span className="text-sm">Previous</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[var(--auditly-dark-blue)] mb-8">
            Great! Your organization setup is complete.
          </h2>

          <div className="space-y-4 mb-8 max-w-2xl">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h4 className="font-semibold text-[var(--auditly-dark-blue)] mb-1">
                  {question.label}
                </h4>
                <p className="text-gray-600">{data[question.id]}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end max-w-2xl">
            <Button
              onClick={handleNext}
              iconRight={<Icon name="arrow_forward" />}
              className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
            >
              Next
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const previousQuestion = getPreviousQuestion();
  const currentValue = currentQuestion.options.find(
    (opt) => opt.label === data[currentQuestion.id]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
    >
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestionIndex}>
          {/* Show previous question if available */}
          {previousQuestion && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8   rounded-lg "
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {previousQuestion.label}
              </h3>
              <div className="max-w-2xl">
                <Select
                  options={previousQuestion.options}
                  value={previousQuestion.options.find(
                    (opt) => opt.label === previousQuestion.answer
                  )}
                  isDisabled={true}
                  styles={{
                    ...selectStyles,
                    control: (provided: any) => ({
                      ...provided,
                      // backgroundColor: "#F9FAFB",
                      // borderColor: "#E5E7EB",
                      cursor: "not-allowed",
                    }),
                  }}
                  placeholder="Previous answer"
                />
              </div>
            </motion.div>
          )}

          {/* Previous button */}
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={handlePreviousQuestion}
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
          </div>

          {/* Header */}
          {currentQuestionIndex === 0 && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-3xl font-bold text-[var(--auditly-dark-blue)] mb-8"
            >
              Customise for Your Organisation
            </motion.h1>
          )}

          {/* Current Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="max-w-2xl"
          >
            <label className="block text-lg font-medium text-[var(--auditly-dark-blue)] mb-4">
              {currentQuestion.label}
            </label>

            <Select
              options={currentQuestion.options}
              value={currentValue}
              onChange={(selectedOption) =>
                handleAnswerChange(currentQuestion.id, selectedOption)
              }
              placeholder={currentQuestion.placeholder}
              styles={selectStyles}
              isSearchable={true}
              isClearable={true}
              menuPlacement="auto"
              noOptionsMessage={() => "No options found"}
            />
          </motion.div>

          {/* Show Next button when on last question and all answered */}
          {data[currentQuestion.id] &&
            currentQuestionIndex === questions.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-8 flex justify-end max-w-2xl"
              >
                <Button
                  onClick={handleNext}
                  iconRight={<Icon name="arrow_forward" />}
                  className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
                >
                  Next
                </Button>
              </motion.div>
            )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
