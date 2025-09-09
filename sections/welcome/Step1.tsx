// sections/welcome/Step1.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAppDispatch } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const dispatch = useAppDispatch();
  const [textContent, setTextContent] = useState("");

  const handleGetStarted = () => {
    dispatch(completeStep(1));
    dispatch(
      updateFormData({ step: 1, data: { welcomed: true, textContent } })
    );
    onNext();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--auditly-dark-blue)] mb-4 sm:mb-6 leading-tight">
          Welcome to Auditly, {"{First Name}"}
          <br className="hidden sm:block" />
          <span className="block sm:inline mt-2 sm:mt-0">
            Let&apos;s set up your NDIS policies step by step.
          </span>
        </h1>
      </div>

      {/* Main Content Box */}
      <div className="w-full">
        <div className="flex flex-col h-[300px] sm:h-[400px] lg:h-[450px]">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder=""
            className="flex-1 w-full p-4 sm:p-6 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-sm sm:text-base leading-relaxed"
          />
        </div>

        {/* Get Started Button - Bottom Right */}
        <div className="flex justify-end mt-4 sm:mt-6">
          <Button
            onClick={handleGetStarted}
            iconRight={<Icon name="arrow_forward" />}
            className="btn-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
