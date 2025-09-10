// components/ui/AdvancedColorPicker.tsx
"use client";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";

interface AdvancedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Utility functions for color conversion
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const isValidHex = (hex: string) => {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

export default function AdvancedColorPicker({
  color,
  onChange,
  isOpen,
  onClose,
}: AdvancedColorPickerProps) {
  const [hexInput, setHexInput] = useState(color);
  const rgb = hexToRgb(color);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      onChange(value);
    }
  };

  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [component]: numValue };
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    onChange(newHex);
    setHexInput(newHex);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 bg-white rounded-xl p-6 shadow-2xl border border-gray-200 max-w-[400px]"
          style={{ top: "-100%", right: "0", marginTop: "8px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-600 text-lg font-semibold flex items-center gap-2">
              <span className="text-purple-600">◇</span>
              Color Picker
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <HexColorPicker
              color={color}
              onChange={(newColor) => {
                onChange(newColor);
                setHexInput(newColor);
              }}
              style={{ width: "100%", height: "200px" }}
            />
          </div>

          {/* Hue Slider */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max="360"
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background:
                  "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
              }}
            />
          </div>

          {/* Hex Input */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm font-medium w-8">Hex</span>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={hexInput.toUpperCase()}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 font-mono text-sm flex-1 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                  placeholder="#1708FF"
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-inner"
                  style={{ backgroundColor: color }}
                />
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* RGB Inputs */}
          <div className="space-y-2">
            <div className="text-gray-700 text-sm font-medium mb-3">RGB</div>
            <div className="grid grid-cols-4 gap-3">
              {/* R Input */}
              <div className="text-center">
                <label className="text-gray-500 text-xs mb-1 block font-medium">
                  R
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange("r", e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-sm text-center w-full focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                />
              </div>

              {/* G Input */}
              <div className="text-center">
                <label className="text-gray-500 text-xs mb-1 block font-medium">
                  G
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange("g", e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-sm text-center w-full focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                />
              </div>

              {/* B Input */}
              <div className="text-center">
                <label className="text-gray-500 text-xs mb-1 block font-medium">
                  B
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange("b", e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-sm text-center w-full focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                />
              </div>

              {/* Alpha Input */}
              <div className="text-center">
                <label className="text-gray-500 text-xs mb-1 block font-medium">
                  A
                </label>
                <input
                  type="text"
                  value="100%"
                  readOnly
                  className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-gray-500 text-sm text-center w-full cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Apply
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
