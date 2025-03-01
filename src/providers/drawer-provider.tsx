// Path: src/providers/drawer-provider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Platform, Dimensions } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

interface DrawerContextType {
  isOpen: boolean;
  isLargeScreen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isDrawerAvailable, setIsDrawerAvailable] = useState(false);
  const navigation = useNavigation();

  // Detectar se o drawer está disponível
  const checkDrawerAvailability = useCallback(() => {
    try {
      // Tente acessar o estado do drawer apenas como verificação
      const state = navigation.getState();
      // Se o drawer estiver disponível, esta ação não lançará erro
      setIsDrawerAvailable(true);
      return true;
    } catch (error) {
      console.log("Drawer não disponível ainda:", error);
      setIsDrawerAvailable(false);
      return false;
    }
  }, [navigation]);

  // Detectar tamanho da tela para determinar se deve mostrar drawer permanente
  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get("window");
      setIsLargeScreen(width >= 1024); // Considerar telas maiores que 1024px como "largas"
    };

    // Verificar tamanho inicial
    checkScreenSize();

    // Adicionar listener para mudanças de dimensão (principalmente relevante para web)
    if (Platform.OS === "web") {
      const dimensionsHandler = Dimensions.addEventListener(
        "change",
        checkScreenSize
      );

      return () => {
        dimensionsHandler.remove();
      };
    }
  }, []);

  // Verificar disponibilidade do drawer quando a navegação muda
  useEffect(() => {
    // Primeira verificação
    checkDrawerAvailability();

    // Tentar novamente após um breve delay para garantir que o drawer foi montado
    const timer = setTimeout(() => {
      checkDrawerAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [checkDrawerAvailability]);

  // Funções para controlar o drawer
  const openDrawer = useCallback(() => {
    if (isDrawerAvailable) {
      try {
        navigation.dispatch(DrawerActions.openDrawer());
        setIsOpen(true);
      } catch (error) {
        console.log("Erro ao abrir drawer:", error);
      }
    } else {
      console.log("Drawer não disponível para abrir");
    }
  }, [navigation, isDrawerAvailable]);

  const closeDrawer = useCallback(() => {
    if (isDrawerAvailable) {
      try {
        navigation.dispatch(DrawerActions.closeDrawer());
        setIsOpen(false);
      } catch (error) {
        console.log("Erro ao fechar drawer:", error);
      }
    } else {
      console.log("Drawer não disponível para fechar");
    }
  }, [navigation, isDrawerAvailable]);

  const toggleDrawer = useCallback(() => {
    if (isDrawerAvailable) {
      try {
        if (isOpen) {
          navigation.dispatch(DrawerActions.closeDrawer());
          setIsOpen(false);
        } else {
          navigation.dispatch(DrawerActions.openDrawer());
          setIsOpen(true);
        }
      } catch (error) {
        console.log("Erro ao alternar drawer:", error);
      }
    } else {
      console.log("Drawer não disponível para alternar");
    }
  }, [navigation, isOpen, isDrawerAvailable]);

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        isLargeScreen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
