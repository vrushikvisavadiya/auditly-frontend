// sections/welcome/Step5.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import RadioGroup from "@/components/ui/RadioGroup";
import AdvancedColorPicker from "@/components/ui/AdvancedColorPicker";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState, useRef, useEffect } from "react";

interface Step5Props {
  onNext: () => void;
  onPrev: () => void;
}

interface Step5FormData {
  stylePreference: string | null;
  styleExample: string | null;
  styleDescription: string;
  hasStyleGuide: boolean;
  styleGuideFile: File | null;
  headerColor: string;
}

// Custom hook for click outside detection
function useClickOutside(handler: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendant elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref;
}

export default function Step5({ onNext, onPrev }: Step5Props) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.welcome.formData[5] || {});

  const [data, setData] = useState<Step5FormData>({
    stylePreference: formData.stylePreference || null,
    styleExample: formData.styleExample || null,
    styleDescription: formData.styleDescription || "",
    hasStyleGuide: formData.hasStyleGuide || false,
    styleGuideFile: formData.styleGuideFile || null,
    headerColor: formData.headerColor || "#FF784B",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAdvancedColorPicker, setShowAdvancedColorPicker] = useState(false);

  // Click outside hook for color picker
  const colorPickerRef = useClickOutside(() => {
    setShowColorPicker(false);
  });

  // Style preference options
  const styleOptions = [
    {
      value: "government",
      label: "Government-style (very formal)",
      emoji: "🏛️",
    },
    {
      value: "professional",
      label: "Professional but clear",
      emoji: "💼",
    },
    {
      value: "friendly",
      label: "Friendly & easy to read",
      emoji: "😊",
    },
  ];

  // Style example options
  const styleExampleOptions = [
    {
      value: "comprehensive",
      label: "Comprehensive (detailed, all-in-one)",
      // description: "Includes all details in one comprehensive document",
    },
    {
      value: "professional",
      label: "Professional (clean, complete)",
      // description: "Clean and organized professional approach",
    },
    {
      value: "user-friendly",
      label: "User-friendly (simple & easy)",
      // description: "Easy to understand and follow format",
    },
  ];

  const handleStylePreferenceChange = (value: string) => {
    setData({ ...data, stylePreference: value });
    setTimeout(() => {
      if (currentStep === 0) {
        setCurrentStep(1);
      }
    }, 500);
  };

  const handleStyleGuideToggle = () => {
    const newValue = !data.hasStyleGuide;
    setData({
      ...data,
      hasStyleGuide: newValue,
      styleGuideFile: newValue ? data.styleGuideFile : null,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setData({ ...data, styleGuideFile: file });
  };

  const handleColorChange = (color: string) => {
    setData({ ...data, headerColor: color });
  };

  const handleNext = () => {
    console.log("clciked next");
    dispatch(completeStep(5));
    dispatch(updateFormData({ step: 5, data }));
    onNext();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onPrev();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.stylePreference !== null;
      case 1:
        return data.hasStyleGuide !== null;
      case 2:
        return data.styleExample !== null;
      default:
        return true;
    }
  };

  // Step 1: Style Preference Selection
  if (currentStep === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
      >
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
            type="button"
          >
            <Icon name="arrow_back" className="text-sm" />
            <span className="text-sm">Previous</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[var(--auditly-dark-blue)] mb-4">
            Great! Now let&apos;s style your policies.
          </h1>
          <p className="text-lg font-semibold text-[var(--auditly-dark-blue)]">
            How formal should they sound?
          </p>
        </motion.div>

        <div className="space-y-4 max-w-2xl">
          {styleOptions.map((option, index) => (
            <motion.label
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2), duration: 0.3 }}
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--auditly-orange)] transition-colors"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="stylePreference"
                  value={option.value}
                  checked={data.stylePreference === option.value}
                  onChange={() => handleStylePreferenceChange(option.value)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[var(--auditly-orange)] peer-checked:bg-[var(--auditly-orange)] flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-lg font-medium text-gray-700">
                    {option.label}
                  </span>
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </motion.div>
    );
  }

  // Step 2: Style Guide Toggle and Color Picker
  if (currentStep === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
      >
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 text-[var(--auditly-dark-blue)] hover:text-[var(--auditly-orange)] transition-colors"
            type="button"
          >
            <Icon name="arrow_upward" className="text-sm" />
            <span className="text-sm">Previous</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Style Guide Section with Toggle Switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--auditly-dark-blue)]">
                Do you have a style guide or branding guide?
              </h3>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={data.hasStyleGuide}
                  onChange={handleStyleGuideToggle}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--auditly-orange)]"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {data.hasStyleGuide ? "Yes" : "No"}
                </span>
              </label>
            </div>

            <AnimatePresence>
              {data.hasStyleGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--auditly-orange)] transition-colors">
                    <input
                      type="file"
                      id="styleGuideFile"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                    <label
                      htmlFor="styleGuideFile"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Icon
                        name="upload_file"
                        className="text-4xl text-gray-400 mb-2"
                      />
                      <span className="text-gray-600">
                        {data.styleGuideFile
                          ? `Selected: ${data.styleGuideFile.name}`
                          : "Click to upload your style guide"}
                      </span>
                      <span className="text-sm text-gray-400 mt-1">
                        PDF, DOC, or image files
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Color Picker Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="relative"
          >
            <h3 className="text-lg font-semibold text-[var(--auditly-dark-blue)] mb-4">
              What colour would you like for your policy headers?
            </h3>

            <div className="flex items-start gap-6">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: data.headerColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <span className="text-white font-bold text-sm">Aa</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Preview
                </p>
              </div>

              <div className="flex-1 max-w-xs">
                <input
                  type="text"
                  value={data.headerColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  placeholder="#FF784B"
                />
                <div className="flex gap-2 mt-2">
                  {!showColorPicker && (
                    <button
                      onClick={() => setShowColorPicker(true)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Simple Picker
                    </button>
                  )}
                  <button
                    onClick={() => setShowAdvancedColorPicker(true)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                  >
                    Advanced Picker
                  </button>
                </div>
              </div>
            </div>

            {/* Simple Color Picker */}
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  ref={colorPickerRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-40 bg-white p-3 rounded-lg shadow-xl border-2 border-gray-200 mt-2"
                >
                  <input
                    type="color"
                    value={data.headerColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-20 h-20 rounded border-none cursor-pointer"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Color Picker */}
            <AdvancedColorPicker
              color={data.headerColor}
              onChange={handleColorChange}
              isOpen={showAdvancedColorPicker}
              onClose={() => setShowAdvancedColorPicker(false)}
            />
          </motion.div>
        </div>

        <div className="mt-12 flex justify-end">
          <Button
            onClick={() => setCurrentStep(2)}
            // disabled={!canProceed()}
            iconRight={<Icon name="arrow_forward" />}
            className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    );
  }

  // Step 3: Style Examples Selection
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
    >
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={handlePrevious}
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
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: data.headerColor }}
          />
          <span className="text-gray-500 font-mono text-sm">
            {data.headerColor}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[var(--auditly-dark-blue)] mb-4">
          Here are some policy style examples.
        </h2>
        {/* 
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div> */}

        <h3 className="text-lg font-semibold text-[var(--auditly-dark-blue)] mb-6">
          Which style do you prefer?
        </h3>
      </motion.div>

      <div className="max-w-2xl">
        <RadioGroup
          options={styleExampleOptions}
          value={data.styleExample}
          onChange={(value) => setData({ ...data, styleExample: value })}
          name="styleExample"
          className="mb-8"
        />

        {/* Optional Description */}
        {data.styleExample && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <h4 className="text-lg font-semibold text-[var(--auditly-dark-blue)] mb-4">
              Any additional styling preferences? (Optional)
            </h4>
            <textarea
              value={data.styleDescription}
              onChange={(e) =>
                setData({ ...data, styleDescription: e.target.value })
              }
              placeholder="Tell us more about your preferred style, tone, or any specific requirements..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-[var(--auditly-dark-blue)] focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:outline-none resize-none text-gray-700 text-base leading-relaxed"
            />
          </motion.div>
        )}
      </div>

      <div className="mt-12 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          iconRight={<Icon name="arrow_forward" />}
          className="px-8 py-3 bg-[var(--auditly-dark-blue)] text-white hover:bg-[var(--auditly-orange)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
