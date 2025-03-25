// Path: src/providers/smart-loading-provider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { usePathname } from "expo-router";

interface LoadingContextType {
  isLoading: boolean;
  isNavigating: boolean;
  isQueryLoading: boolean;
  isManualLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

// Cria o contexto com valores padrão
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  isNavigating: false,
  isQueryLoading: false,
  isManualLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLoading = () => {
  return useContext(LoadingContext);
};

export function SmartLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estados para diferentes tipos de loading
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [navigationInProgress, setNavigationInProgress] = useState(false);

  // React Query hooks para detectar operações de dados
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isQueryLoading = isFetching > 0 || isMutating > 0;

  // Para navegação
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detectar mudanças de rota
  useEffect(() => {
    // Se o pathname mudou, sabemos que estamos navegando
    if (pathname !== previousPathname.current) {
      setNavigationInProgress(true);
      previousPathname.current = pathname;

      // Limpar timer existente
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }

      // Define timeout para marcar que a navegação terminou
      navigationTimeout.current = setTimeout(() => {
        setNavigationInProgress(false);
      }, 300);
    }

    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, [pathname]);

  // Timer para atrasar a exibição do loader para navegações rápidas
  const loaderTimer = useRef<NodeJS.Timeout | null>(null);
  const [shouldShowNavigationLoader, setShouldShowNavigationLoader] =
    useState(false);

  useEffect(() => {
    // Se começou a navegar, vamos preparar para mostrar o loader após um pequeno delay
    if (navigationInProgress) {
      // Cancela timer existente
      if (loaderTimer.current) {
        clearTimeout(loaderTimer.current);
      }

      // Só mostra o loader se demorar mais que 200ms
      loaderTimer.current = setTimeout(() => {
        // Apenas mostra o loader se estiver realmente em uma operação de fetch
        if (isQueryLoading) {
          setShouldShowNavigationLoader(true);
        }
      }, 200);
    } else {
      // Se a navegação terminou, podemos esconder o loader
      setShouldShowNavigationLoader(false);

      // E cancelar o timer se existir
      if (loaderTimer.current) {
        clearTimeout(loaderTimer.current);
        loaderTimer.current = null;
      }
    }

    return () => {
      if (loaderTimer.current) {
        clearTimeout(loaderTimer.current);
      }
    };
  }, [navigationInProgress, isQueryLoading]);

  // Determina se o loader deve ser mostrado
  // Só mostra se: 1) Houver uma operação manual ou 2) Houver query E navegação lenta
  const isNavigating = shouldShowNavigationLoader && navigationInProgress;
  const isLoading = isManualLoading || (isQueryLoading && isNavigating);

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
    isNavigating,
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
