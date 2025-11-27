"use client";

import { createContext, useState, useContext } from "react";

interface FilterContextType {
  isFilterPanelOpen: boolean;
  openFilterPanel: () => void;
  closeFilterPanel: () => void;
  toggleFilterPanel: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const openFilterPanel = () => {
    setIsFilterPanelOpen(true);
  };

  const closeFilterPanel = () => {
    setIsFilterPanelOpen(false);
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen((prev) => !prev);
  };

  return (
    <FilterContext.Provider
      value={{
        isFilterPanelOpen,
        openFilterPanel,
        closeFilterPanel,
        toggleFilterPanel,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
