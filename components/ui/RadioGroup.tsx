// components/ui/RadioGroup.tsx
"use client";
import { motion } from "framer-motion";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  className = "",
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option, index) => (
        <motion.label
          key={option.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.3 }}
          className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--auditly-orange)] transition-colors group"
        >
          <div className="relative mt-1">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[var(--auditly-orange)] peer-checked:bg-[var(--auditly-orange)] flex items-center justify-center transition-colors">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <span className="text-lg font-medium text-gray-700 group-hover:text-[var(--auditly-dark-blue)] transition-colors">
              {option.label}
            </span>
            {option.description && (
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            )}
          </div>
        </motion.label>
      ))}
    </div>
  );
}
