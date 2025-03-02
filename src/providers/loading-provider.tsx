// Path: src/providers/loading-provider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { usePathname } from "expo-router";

type LoadingType = "query" | "navigation" | "manual";

interface LoadingContextType {
  isLoading: boolean;
  isNavigating: boolean;
  isQueryLoading: boolean;
  isManualLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  // Estados para diferentes tipos de loading
  const [isNavigating, setIsNavigating] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);

  // Referências para pathname anterior e timeout
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  // React Query hooks para detectar operações de dados
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isQueryLoading = isFetching > 0 || isMutating > 0;

  // Estado combinado de loading
  const isLoading = isNavigating || isQueryLoading || isManualLoading;

  // Detectar mudanças de rota
  useEffect(() => {
    if (pathname !== previousPathname.current) {
      setIsNavigating(true);
      previousPathname.current = pathname;

      // Limpar timeout existente
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }

      // Definir timeout para esconder o loader de navegação
      navigationTimeout.current = setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }

    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, [pathname]);

  // Funções para loading manual
  const showLoader = () => setIsManualLoading(true);
  const hideLoader = () => setIsManualLoading(false);

  const value = {
    isLoading,
    isNavigating,
    isQueryLoading,
    isManualLoading,
    showLoader,
    hideLoader,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
