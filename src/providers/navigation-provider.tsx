import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "expo-router";
import { StatusBar, Platform } from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";

// Interface para o contexto
interface NavigationContextType {
  isCompanyPage: boolean;
  currentRoute: string;
}

// Criação do contexto com valores padrão
const NavigationContext = createContext<NavigationContextType>({
  isCompanyPage: false,
  currentRoute: "",
});

// Hook para usar o contexto
export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [isCompanyPage, setIsCompanyPage] = useState(false);

  // Atualização do estado baseado na rota atual
  useEffect(() => {
    // Verifica se está em uma página de empresa
    const companyPageRegex = /\/empresa\/([^\/]+)/;
    const isInCompanyPage = companyPageRegex.test(pathname);

    setIsCompanyPage(isInCompanyPage);

    // Atualiza a barra de status baseado na rota
    if (Platform.OS !== "web") {
      if (isInCompanyPage) {
        // Se estiver em uma página de empresa, usa a cor da empresa (será definida pelo componente da empresa)
        StatusBar.setBarStyle("light-content");
      } else {
        // Caso contrário, usa a cor primária do tema
        StatusBar.setBackgroundColor(THEME_COLORS.primary);
        StatusBar.setBarStyle("light-content");
      }
    }
  }, [pathname]);

  // Valor do contexto
  const value = {
    isCompanyPage,
    currentRoute: pathname,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
