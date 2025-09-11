// components/ui/LeaveOnboardingModal.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

interface LeaveOnboardingModalProps {
  isOpen: boolean;
  onLeaveAnyway: () => void;
  onStayAndFinish: () => void;
}

export default function LeaveOnboardingModal({
  isOpen,
  onLeaveAnyway,
  onStayAndFinish,
}: LeaveOnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
        >
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-[var(--auditly-orange)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Leave Onboarding?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to leave without finishing the onboarding?
              All information you&apos;ve entered so far will be lost.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onLeaveAnyway}
              className="flex-1 px-4 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Leave Anyway
            </button>
            <button
              onClick={onStayAndFinish}
              className="flex-1 px-4 py-3 bg-[var(--auditly-orange)] text-white font-semibold rounded-lg hover:bg-[var(--auditly-orange)]/90 transition-colors"
            >
              Stay and Finish
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
