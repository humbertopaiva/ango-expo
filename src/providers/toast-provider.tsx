// src/providers/toast-provider.tsx
import React, { ReactNode, createContext, useContext } from "react";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@gluestack-ui/themed";
import { Icon } from "@gluestack-ui/themed";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react-native";
import { View } from "react-native";

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
  const toast = useToast();

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
    toast.show({
      placement: "top",
      duration,
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <Toast
            nativeID={toastId}
            className={`p-4 rounded-lg border ${getBgColor(
              type
            )} shadow-lg w-full max-w-[400px] mx-4 mt-4`}
          >
            <View className="flex-row items-start space-x-3">
              <View className="mt-0.5">{getIcon(type)}</View>
              <View className="flex-1">
                <ToastTitle className={`font-medium ${getTextColor(type)}`}>
                  {title}
                </ToastTitle>
                {description && (
                  <ToastDescription className={getTextColor(type)}>
                    {description}
                  </ToastDescription>
                )}
              </View>
            </View>
          </Toast>
        );
      },
    });
  };

  return (
    <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
