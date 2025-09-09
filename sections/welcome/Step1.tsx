// sections/welcome/Step1.tsx
"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAppDispatch } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const dispatch = useAppDispatch();

  const handleGetStarted = () => {
    dispatch(completeStep(1));
    dispatch(updateFormData({ step: 1, data: { welcomed: true } }));
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--auditly-dark-blue)] mb-4">
          Welcome to Auditly, {"{First Name}"} 👋
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Let&apos;s set up your NDIS policies step by step.
        </p>
      </div>

      {/* Video/Content Placeholder */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="play_arrow" className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-500">Video content placeholder</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleGetStarted}
          iconRight={<Icon name="arrow_forward" />}
          className="btn-lg"
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
