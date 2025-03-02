// Path: src/providers/navigation-loading-provider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "expo-router";

interface NavigationLoadingContextType {
  isNavigating: boolean;
  startNavigationLoading: () => void;
  stopNavigationLoading: () => void;
}

const NavigationLoadingContext = createContext<
  NavigationLoadingContextType | undefined
>(undefined);

export const useNavigationLoading = () => {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error(
      "useNavigationLoading must be used within a NavigationLoadingProvider"
    );
  }
  return context;
};

export function NavigationLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Funções manuais para controlar o estado de navegação
  const startNavigationLoading = () => setIsNavigating(true);
  const stopNavigationLoading = () => setIsNavigating(false);

  // Detectar mudanças de rota
  useEffect(() => {
    // Quando o pathname muda, iniciamos o loading
    if (pathname !== previousPathname.current) {
      setIsNavigating(true);

      // Atualizamos a referência do pathname anterior
      previousPathname.current = pathname;

      // Definimos um timeout para garantir que o loading será removido
      // mesmo se a navegação for muito rápida
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }

      navigationTimeout.current = setTimeout(() => {
        setIsNavigating(false);
      }, 800); // Um tempo razoável para a maioria das navegações
    }

    // Limpeza do timeout quando o componente é desmontado
    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, [pathname]);

  return (
    <NavigationLoadingContext.Provider
      value={{
        isNavigating,
        startNavigationLoading,
        stopNavigationLoading,
      }}
    >
      {children}
    </NavigationLoadingContext.Provider>
  );
}
