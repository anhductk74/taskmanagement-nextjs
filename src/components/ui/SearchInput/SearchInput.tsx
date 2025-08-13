"use client";

import React, { useCallback } from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  showShortcut?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "bordered";
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Search...",
  showShortcut = true,
  className = "",
  size = "md",
  variant = "default",
}) => {
  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  // Size variants
  const sizeClasses = {
    sm: "py-2 pl-9 pr-16 text-sm",
    md: "py-2.5 pl-10 pr-18 text-sm", 
    lg: "py-3 pl-12 pr-20 text-base",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const iconPositions = {
    sm: "left-2.5",
    md: "left-3",
    lg: "left-3.5",
  };


  // Variant styles with integrated dark mode
  const variantClasses = {
    default: "bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
    minimal: "bg-transparent dark:bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-0 focus:bg-gray-50 dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
    bordered: "bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0"
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className={`absolute inset-y-0 ${iconPositions[size]} flex items-center pointer-events-none`}>
        <Search 
          size={iconSizes[size]} 
          className="text-gray-400 dark:text-gray-500" 
        />
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`
          w-full rounded-full transition-all duration-200 outline-none
          ${sizeClasses[size]}
          ${variantClasses[variant]}`}
      />

      {/* Right Side Actions */}
      <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-0.5 rounded"
            aria-label="Clear search"
          >
            <X size={iconSizes[size] - 2} />
          </button>
        )}

        {/* Keyboard Shortcut */}
        {showShortcut && !value && (
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 border border-gray-200 dark:border-gray-600 rounded">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
};

export default SearchInput;