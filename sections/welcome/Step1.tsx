// sections/welcome/Step1.tsx
"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/src/redux/hooks";
import { completeStep, updateFormData } from "@/src/redux/slices/welcomeSlice";
import { useState } from "react";

import Playiconstep1 from "../../public/icons/playiconstep1.svg";

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const dispatch = useAppDispatch();
  const [hasWatched, setHasWatched] = useState(false);

  const handleGetStarted = () => {
    dispatch(completeStep(1));
    dispatch(updateFormData({ step: 1, data: { welcomed: true, hasWatched } }));
    onNext();
  };

  const handleVideoClick = () => {
    setHasWatched(true);
    // You can add actual video modal logic here
    console.log("Video clicked - would open video modal/player");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-200px)]"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--auditly-dark-blue)] mb-4 sm:mb-6 leading-tight">
          Welcome to Auditly, {"{First Name}"} 👋
          <br className="hidden sm:block" />
          <span className="block sm:inline mt-2 sm:mt-0">
            Let&apos;s set up your NDIS policies step by step.
          </span>
        </h1>
      </motion.div>

      {/* Video Container */}
      <div className="w-full">
        <motion.div
          className="flex flex-col h-[300px] sm:h-[400px] lg:h-[450px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Video Play Area */}
          <motion.div
            onClick={handleVideoClick}
            className="flex-1 w-full border-2 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center justify-center relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Video Play Icon */}
            <motion.div
              className="flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {/* Large Play Button */}
              <motion.div
                className="w-24 h-24 sm:w-24 sm:h-24 lg:w-32 lg:h-28 bg-[var(--auditly-orange)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                whileHover={{
                  rotate: 5,
                  boxShadow: "0 10px 25px rgba(255, 120, 75, 0.3)",
                }}
                whileTap={{ rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Playiconstep1 />
              </motion.div>
            </motion.div>

            {/* Video Status Indicator */}
            {hasWatched && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Icon name="check" className="text-white text-sm" />
              </motion.div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-lg bg-[var(--auditly-orange)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </motion.div>
        </motion.div>

        {/* Get Started Button - Bottom Right */}
        <motion.div
          className="flex justify-end mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              onClick={handleGetStarted}
              iconRight={<Icon name="arrow_forward" />}
              className="btn-lg px-6 sm:px-3 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
            >
              Get started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
