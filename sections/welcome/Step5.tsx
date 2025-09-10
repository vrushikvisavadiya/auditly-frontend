// sections/welcome/Step5.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState, useRef, useEffect } from "react";
import AdvancedColorPicker from "@/components/ui/AdvancedColorPicker";

interface Step5Props {
  onNext: () => void;
  onPrev: () => void;
}

interface Step5FormData {
  stylePreference: string | null;
  styleExample: string | null;
  hasStyleGuide: boolean;
  styleGuideFile: File | null;
  headerColor: string;
}

// Fixed Custom hook for click outside detection
function useClickOutside(handler: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
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
    hasStyleGuide: formData.hasStyleGuide || false,
    styleGuideFile: formData.styleGuideFile || null,
    headerColor: formData.headerColor || "#FF784B",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);

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
      description: "Formal, comprehensive documentation style",
    },
    {
      value: "professional",
      label: "Professional but clear",
      emoji: "💼",
      description: "Balance of professionalism and clarity",
    },
    {
      value: "friendly",
      label: "Friendly & easy to read",
      emoji: "😊",
      description: "Simple, approachable language",
    },
  ];

  const handleStylePreferenceChange = (value: string) => {
    setData({ ...data, stylePreference: value });
    // Auto advance after selection
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
      // Clear file if switching to false
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
    return data.stylePreference !== null;
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
        {/* Previous button */}
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

        {/* Header */}
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

        {/* Style Options */}
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
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
    >
      {/* Previous button */}
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

            {/* Custom Toggle Switch */}
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

          {/* Conditional File Upload with proper AnimatePresence */}
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
            {/* Color Preview */}
            <div className="relative">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer flex items-center justify-center"
                style={{ backgroundColor: data.headerColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span className="text-white font-bold text-sm">Aa</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">Preview</p>
            </div>

            {/* Simple Color Input */}
            <div className="flex-1 max-w-xs">
              <input
                type="text"
                value={data.headerColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                placeholder="#FF784B"
              />
              {!showColorPicker && (
                <button
                  onClick={() => setShowColorPicker(true)}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Advanced Color Picker
                </button>
              )}
            </div>
          </div>

          {/* Advanced Color Picker */}
          <AdvancedColorPicker
            color={data.headerColor}
            onChange={handleColorChange}
            isOpen={showColorPicker}
            onClose={() => setShowColorPicker(false)}
          />
        </motion.div>
      </div>

      {/* Navigation */}
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
