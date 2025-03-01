// Path: src/providers/drawer-provider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation();

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

  // Funções para controlar o drawer
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
    setIsOpen(true);
  };

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    setIsOpen(false);
  };

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

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
