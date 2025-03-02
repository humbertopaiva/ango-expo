// Path: src/providers/query-loading-provider.tsx (atualizado)
import React, { createContext, useContext, useState, useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useNavigationLoading } from "./navigation-loading-provider";

interface QueryLoadingContextType {
  isLoading: boolean;
  showManualLoader: () => void;
  hideManualLoader: () => void;
}

const QueryLoadingContext = createContext<QueryLoadingContextType | undefined>(
  undefined
);

export const useQueryLoading = () => {
  const context = useContext(QueryLoadingContext);
  if (!context) {
    throw new Error(
      "useQueryLoading must be used within a QueryLoadingProvider"
    );
  }
  return context;
};

export function QueryLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  // Obtém o estado de navegação
  const { isNavigating } = useNavigationLoading();

  // Monitorar se há queries em andamento
  const isFetching = useIsFetching();

  // Monitorar se há mutações em andamento
  const isMutating = useIsMutating();

  // Combinar os estados para determinar se algo está carregando
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(
        isFetching > 0 || isMutating > 0 || manualLoading || isNavigating
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [isFetching, isMutating, manualLoading, isNavigating]);

  const showManualLoader = () => setManualLoading(true);
  const hideManualLoader = () => setManualLoading(false);

  return (
    <QueryLoadingContext.Provider
      value={{
        isLoading,
        showManualLoader,
        hideManualLoader,
      }}
    >
      {children}
    </QueryLoadingContext.Provider>
  );
}
