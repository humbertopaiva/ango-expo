// Path: src/providers/loading-provider.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

interface LoadingContextType {
  isLoading: boolean;
  isQueryLoading: boolean;
  isManualLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  isQueryLoading: false,
  isManualLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLoading = () => {
  return useContext(LoadingContext);
};

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  // Estado para o loading manual
  const [isManualLoading, setIsManualLoading] = useState(false);

  // React Query hooks para detectar operações de dados
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isQueryLoading = isFetching > 0 || isMutating > 0;

  // Calculamos se o loading deve ser mostrado baseado nas queries e loading manual
  const isLoading = isManualLoading || isQueryLoading;

  // Funções para loading manual
  const showLoader = useCallback(() => {
    setIsManualLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsManualLoading(false);
  }, []);

  // Valor do contexto
  const contextValue = {
    isLoading,
    isQueryLoading,
    isManualLoading,
    showLoader,
    hideLoader,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
