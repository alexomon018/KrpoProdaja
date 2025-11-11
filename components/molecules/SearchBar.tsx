"use client";

import * as React from "react";
import cn from "@/lib/utils";
import { Input } from "@/components/atoms";
import { Search, X } from "@/components/atoms/Icon";

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: string[];
  showSuggestions?: boolean;
}

/**
 * SearchBar Component - Atomic Design: Molecule
 *
 * Persistent search with auto-complete suggestions
 * Follows Vinted's search architecture
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Pretraži po nazivu, brendu ili prodavcu"
 *   onSearch={(query) => handleSearch(query)}
 *   suggestions={recentSearches}
 * />
 * ```
 */
const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      placeholder = "Pretraži po nazivu, brendu ili prodavcu",
      onSearch,
      onClear,
      suggestions = [],
      showSuggestions = false,
      value: controlledValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);
    const [showSuggestionsList, setShowSuggestionsList] = React.useState(false);

    const inputValue = controlledValue !== undefined ? controlledValue : value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onChange?.(e);

      if (newValue.length >= 2) {
        setShowSuggestionsList(true);
      } else {
        setShowSuggestionsList(false);
      }
    };

    const handleClear = () => {
      setValue("");
      setShowSuggestionsList(false);
      onClear?.();
    };

    const handleSearch = (query: string) => {
      onSearch?.(query);
      setShowSuggestionsList(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch(inputValue as string);
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      setValue(suggestion);
      handleSearch(suggestion);
    };

    return (
      <div className={cn("relative w-full", className)}>
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            startIcon={<Search size={20} />}
            endIcon={
              inputValue && (
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-background rounded transition-colors"
                  aria-label="Obriši pretragu"
                >
                  <X size={16} />
                </button>
              )
            }
            className="pr-10"
            {...props}
          />
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions &&
          showSuggestionsList &&
          isFocused &&
          suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="py-2">
                <div className="px-3 py-1.5 text-xs text-text-tertiary uppercase font-semibold">
                  Nedavne pretrage
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-background transition-colors flex items-center gap-2"
                  >
                    <Search size={16} className="text-text-tertiary" />
                    <span className="text-sm text-text-primary">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
