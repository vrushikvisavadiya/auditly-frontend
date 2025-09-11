"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

// Custom Toggle Button Component for Yes/No with Framer Motion
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

// Animation variants
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const previousQuestionVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 0.6,
    height: "auto",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="pt-10"
      key={question}
    >
      {/* Show previous question if available */}
      <AnimatePresence>
        {previousQuestion && (
          <motion.div
            variants={previousQuestionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mb-8 pb-6 border-b border-gray-200 overflow-hidden"
          >
            <motion.h3
              className="text-lg font-medium text-gray-500 mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {previousQuestion.text}
            </motion.h3>
            {previousQuestion.description && (
              <motion.p
                className="text-sm text-gray-400 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {previousQuestion.description}
              </motion.p>
            )}
            <motion.div
              className="flex gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="button"
                disabled
                className={`px-6 py-2 rounded-lg font-semibold cursor-not-allowed ${
                  previousQuestion.answer === false
                    ? "bg-[var(--auditly-orange)] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                ❌ No
              </button>
              <button
                type="button"
                disabled
                className={`px-6 py-2 rounded-lg font-semibold cursor-not-allowed ${
                  previousQuestion.answer === true
                    ? "bg-[var(--auditly-dark-blue)] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                ✅ Yes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPrevious && onPrevious && (
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={onPrevious}
            className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={buttonVariants}
          >
            <Icon
              name={isFirstQuestion ? "arrow_back" : "arrow_upward"}
              className="text-sm"
            />
            <span className="text-sm">Previous</span>
          </motion.button>
        </motion.div>
      )}

      {isFirstQuestion && (
        <motion.h3
          className="text-xl font-medium text-[var(--auditly-dark-blue)] mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {data?.text}
        </motion.h3>
      )}

      {/* Current Question */}
      <motion.h3
        className="text-lg font-medium text-[var(--auditly-dark-blue)] mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {question}
      </motion.h3>
      {description && (
        <motion.p
          className="text-sm text-gray-600 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {description}
        </motion.p>
      )}

      <motion.div
        className="flex gap-3"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          type="button"
          onClick={() => onChange(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            value === false
              ? "bg-[var(--auditly-orange)] text-white focus:ring-orange-500"
              : "bg-[var(--auditly-orange)] text-white hover:bg-gray-300 focus:ring-gray-500"
          }`}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          ❌ No
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onChange(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            value === true
              ? "bg-[var(--auditly-dark-blue)] text-white focus:ring-blue-500"
              : "bg-[var(--auditly-dark-blue)] text-white hover:bg-gray-300 focus:ring-gray-500"
          }`}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          ✅ Yes
        </motion.button>
      </motion.div>
    </motion.div>
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
    if (showSummary) {
      // From summary, go back to last question
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

  const handlePreviousFromSummary = () => {
    setShowSummary(false);
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <motion.button
              onClick={handlePreviousFromSummary}
              className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="arrow_upward" className="text-sm" />
              <span className="text-sm">Previous</span>
            </motion.button>
          </div>

          <motion.h3
            className="text-xl font-semibold text-[var(--auditly-dark-blue)] mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Policy Package so far:
          </motion.h3>

          <motion.div
            className="space-y-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getPolicyPackages().map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Icon name="check" className="text-white text-xs" />
                </div>
                <span className="text-gray-700 text-base">{pkg.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex justify-end"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleNext}
                iconRight={<Icon name="arrow_forward" />}
                className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors"
              >
                Next
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const prevQ = getPreviousQuestion() ?? undefined;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </div>
    </div>
  );
}
