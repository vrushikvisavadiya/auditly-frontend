// components/ui/LoadingDots.tsx
"use client";
import { motion } from "framer-motion";

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-[var(--auditly-dark-blue)] rounded-full"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}
