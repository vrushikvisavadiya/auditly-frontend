// components/ui/MultiSelect.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";

export interface OptionType {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: OptionType[];
  selectedValues: OptionType[];
  onSelect: (selectedList: OptionType[]) => void;
  placeholder: string;
  searchable?: boolean;
  className?: string;
}

export default function MultiSelect({
  options = [],
  selectedValues = [], // Default to empty array
  onSelect,
  placeholder,
  searchable = true,
  className = "",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure selectedValues is always an array
  const safeSelectedValues = Array.isArray(selectedValues)
    ? selectedValues
    : [];
  const safeOptions = Array.isArray(options) ? options : [];

  // Filter options based on search term
  const filteredOptions = safeOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionToggle = (option: OptionType) => {
    console.log("Toggling option:", option);
    const isSelected = safeSelectedValues.some((item) => item.id === option.id);
    let newSelection: OptionType[];

    if (isSelected) {
      newSelection = safeSelectedValues.filter((item) => item.id !== option.id);
    } else {
      newSelection = [...safeSelectedValues, option];
    }

    console.log("New selection:", newSelection);
    onSelect(newSelection);
  };

  const removeItem = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Removing item:", optionId);
    const newSelection = safeSelectedValues.filter(
      (item) => item.id !== optionId
    );
    onSelect(newSelection);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    console.log("Toggling dropdown, isOpen:", !isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Main Input Display */}
      <div
        className={`min-h-[50px] p-3 border-2 rounded-lg cursor-pointer transition-colors ${
          isOpen
            ? "border-[var(--auditly-orange)] ring-2 ring-[var(--auditly-orange)]/20"
            : "border-gray-300 hover:border-gray-400"
        } bg-white flex flex-wrap gap-2 items-center`}
        onClick={toggleDropdown}
      >
        {/* Selected Items */}
        {safeSelectedValues.length === 0 ? (
          <span className="text-gray-400 flex-1">{placeholder}</span>
        ) : (
          <>
            {safeSelectedValues.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center px-3 py-1 bg-[var(--auditly-orange)]/20 text-black text-sm rounded-md gap-2"
              >
                {item.name}
                <button
                  type="button"
                  onClick={(e) => removeItem(item.id, e)}
                  className="hover:text-red-600 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Icon name="close" className="text-sm" />
                </button>
              </span>
            ))}
          </>
        )}

        {/* Dropdown Arrow */}
        <div className="ml-auto">
          <Icon
            name={isOpen ? "expand_less" : "expand_more"}
            className="text-gray-400"
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search options..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--auditly-dark-blue)]/20 focus:border-[var(--auditly-dark-blue)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? "No options found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = safeSelectedValues.some(
                  (item) => item.id === option.id
                );
                return (
                  <div
                    key={option.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleOptionToggle(option)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Controlled by parent onClick
                      className="w-4 h-4 text-[var(--auditly-orange)] rounded focus:ring-[var(--auditly-dark-blue)]/20"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1">
                      {option.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
