// Path: src/providers/navigation-provider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { router, usePathname, useSegments } from "expo-router";

type NavigationContextType = {
  previousRoute: string | null;
  currentRoute: string;
  navigateBack: () => void;
  setCustomBackRoute: (route: string | null) => void;
  clearCustomBackRoute: () => void;
  canGoBack: boolean;
};

// Contexto para gerenciar navegação
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Hook para acessar o contexto
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigation deve ser usado dentro de um NavigationProvider"
    );
  }
  return context;
};

// Estrutura para armazenar o histórico de navegação
interface NavigationState {
  routeHistory: string[];
  customBackRoute: string | null;
}

// Número máximo de rotas para manter no histórico
const MAX_HISTORY_SIZE = 10;

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    routeHistory: [],
    customBackRoute: null,
  });

  const pathname = usePathname();
  const segments = useSegments();

  // Função para determinar se uma rota deve ser ignorada no histórico
  const shouldIgnoreRoute = (route: string): boolean => {
    // Exemplo: ignorar algumas rotas específicas
    const ignoredRoutes = ["/_layout", "/index", "/undefined", null, ""];

    return ignoredRoutes.includes(route);
  };

  // Atualiza o histórico de navegação quando o pathname muda
  useEffect(() => {
    if (shouldIgnoreRoute(pathname)) {
      return;
    }

    // Atualiza o histórico
    setNavigationState((prevState) => {
      // Evita duplicatas consecutivas
      if (
        prevState.routeHistory.length > 0 &&
        prevState.routeHistory[prevState.routeHistory.length - 1] === pathname
      ) {
        return prevState;
      }

      // Cria uma nova lista de histórico
      const newHistory = [...prevState.routeHistory, pathname];

      // Limita o tamanho do histórico
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      return {
        ...prevState,
        routeHistory: newHistory,
      };
    });
  }, [pathname]);

  // Função para navegar de volta
  const navigateBack = () => {
    // Se houver uma rota personalizada de retorno, use-a
    if (navigationState.customBackRoute) {
      router.push(navigationState.customBackRoute as any);
      return;
    }

    // Caso contrário, use o histórico
    const history = navigationState.routeHistory;

    if (history.length > 1) {
      // Pega a segunda rota mais recente (anterior à atual)
      const previousRoute = history[history.length - 2];
      router.push(previousRoute as any);

      // Atualiza o histórico removendo a rota atual
      setNavigationState((prevState) => ({
        ...prevState,
        routeHistory: prevState.routeHistory.slice(0, -1),
      }));
    } else {
      // Sem histórico, volte para uma rota padrão
      const defaultRoute = "/(drawer)/(tabs)/comercio-local";
      router.push(defaultRoute as any);
    }
  };

  // Define uma rota personalizada de retorno
  const setCustomBackRoute = (route: string | null) => {
    setNavigationState((prevState) => ({
      ...prevState,
      customBackRoute: route,
    }));
  };

  // Limpa a rota personalizada de retorno
  const clearCustomBackRoute = () => {
    setNavigationState((prevState) => ({
      ...prevState,
      customBackRoute: null,
    }));
  };

  // Determina se podemos retornar
  const canGoBack =
    navigationState.routeHistory.length > 1 ||
    !!navigationState.customBackRoute;

  // Obtém a rota anterior a partir do histórico
  const previousRoute =
    navigationState.routeHistory.length > 1
      ? navigationState.routeHistory[navigationState.routeHistory.length - 2]
      : null;

  // Obtém a rota atual
  const currentRoute = pathname || "/";

  // Valores para o contexto
  const contextValue = {
    previousRoute,
    currentRoute,
    navigateBack,
    setCustomBackRoute,
    clearCustomBackRoute,
    canGoBack,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};
