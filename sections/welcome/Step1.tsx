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
      updateFormData({ step: 1, data: { welcomed: true, textContent: "" } })
    );
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <div className=" mb-12">
        <h1 className="text-4xl  font-bold text-[var(--auditly-dark-blue)] mb-6 leading-tight">
          Welcome to Auditly, {"{First Name}"} <br />
          Let&apos;s set up your NDIS policies step by step.
        </h1>
      </div>

      {/* Main Content Box */}
      <div className="max-w-5xl mx-auto">
        <div className="">
          <div className="min-h-[400px] flex flex-col">
            {/* <label className="block text-lg font-medium text-[var(--auditly-dark-blue)] mb-4">
              Tell us about your organization and goals:
            </label> */}
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder=""
              className="flex-1 w-full p-6 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-base leading-relaxed min-h-[400px]"
              style={{ minHeight: "400px" }}
            />
            {/* <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                {textContent.length} characters
              </p>
              <p className="text-sm text-gray-500">
                This information helps us customize your experience
              </p>
            </div> */}
          </div>

          {/* Get Started Button - Bottom Right */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleGetStarted}
              iconRight={<Icon name="arrow_forward" />}
              className="btn-lg px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
