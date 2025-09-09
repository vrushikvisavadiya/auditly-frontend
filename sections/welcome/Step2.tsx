// sections/welcome/Step2.tsx
"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputWrapper from "@/components/InputWrapper";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  completeStep,
  Step2Data,
  updateFormData,
} from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2({ onNext, onPrev }: Step2Props) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.welcome.formData[2] || {});

  const [data, setData] = useState<Step2Data>({
    businessName: formData?.businessName || "",
    businessType: formData?.businessType || "",
  });

  const handleNext = () => {
    dispatch(completeStep(2));
    dispatch(updateFormData({ step: 2, data })); // Now fully typed!
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[var(--auditly-dark-blue)] mb-4">
          Organisation Discovery
        </h1>
        <p className="text-lg text-gray-600">Tell us about your business</p>
      </div>

      <div className="space-y-6 mb-8">
        <InputWrapper label="Business Name">
          <input
            type="text"
            className="input input-bordered w-full"
            value={data.businessName}
            onChange={(e) => setData({ ...data, businessName: e.target.value })}
            placeholder="Enter your business name"
          />
        </InputWrapper>

        <InputWrapper label="Business Type">
          <select
            className="select select-bordered w-full"
            value={data.businessType}
            onChange={(e) => setData({ ...data, businessType: e.target.value })}
          >
            <option value="">Select business type</option>
            <option value="disability-support">
              Disability Support Services
            </option>
            <option value="healthcare">Healthcare Provider</option>
            <option value="therapy">Therapy Services</option>
            <option value="other">Other</option>
          </select>
        </InputWrapper>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          iconLeft={<Icon name="arrow_back" />}
          className="btn-outline"
        >
          Previous
        </Button>
        <Button onClick={handleNext} iconRight={<Icon name="arrow_forward" />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
