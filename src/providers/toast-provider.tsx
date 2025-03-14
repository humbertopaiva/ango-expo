// Path: src/providers/toast-provider.tsx
import React, { ReactNode, createContext, useContext } from "react";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
  useToast as useGluestackToast,
  Box,
  HStack,
} from "@gluestack-ui/themed";
import { Icon } from "@gluestack-ui/themed";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react-native";
import { Platform, StyleSheet, Dimensions } from "react-native";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  show: (options: {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const gluestackToast = useGluestackToast();
  const { width: screenWidth } = Dimensions.get("window");

  const getIcon = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return <CheckCircle size={22} color="#22C55E" />;
      case "error":
        return <XCircle size={22} color="#EF4444" />;
      case "warning":
        return <AlertTriangle size={22} color="#F59E0B" />;
      case "info":
      default:
        return <Info size={22} color="#3B82F6" />;
    }
  };

  const getBgColor = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  const getTextColor = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
      default:
        return "text-blue-800";
    }
  };

  const getBorderColor = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      case "warning":
        return "border-yellow-200";
      case "info":
      default:
        return "border-blue-200";
    }
  };

  // Calculando valores numéricos compatíveis com DimensionValue
  const maxToastWidth = Platform.OS === "web" ? 400 : screenWidth * 0.92;

  // Usando StyleSheet para definir os estilos
  const styles = StyleSheet.create({
    toast: {
      elevation: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderRadius: 8,
      maxWidth: maxToastWidth,
      width: "auto",
      alignSelf: "center",
      zIndex: 9999,
    },
  });

  const show = ({
    title,
    description,
    type = "info",
    duration = 3000,
  }: {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
  }) => {
    gluestackToast.show({
      placement: "bottom", // Posicionamento na parte inferior
      duration,
      render: ({ id }) => {
        const toastId = "toast-" + id;

        return (
          <Toast
            nativeID={toastId}
            action="attention"
            variant="solid"
            className={`${getBgColor(type)} border ${getBorderColor(type)}`}
            style={styles.toast}
          >
            <HStack space="sm" alignItems="flex-start" className="p-4">
              <Box className="mt-0.5">{getIcon(type)}</Box>
              <VStack space="xs" className="flex-1">
                <ToastTitle
                  className={`font-medium ${getTextColor(type)}`}
                  style={{ fontSize: 16 }}
                >
                  {title}
                </ToastTitle>
                {description && (
                  <ToastDescription
                    className={`${getTextColor(type)}`}
                    style={{ fontSize: 14, opacity: 0.9 }}
                  >
                    {description}
                  </ToastDescription>
                )}
              </VStack>
            </HStack>
          </Toast>
        );
      },
    });
  };

  return (
    <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
