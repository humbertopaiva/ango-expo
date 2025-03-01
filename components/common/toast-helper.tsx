// components/common/simplified-toast.tsx
import React from "react";
import { View, Text } from "react-native";
import { useToast, Toast } from "@gluestack-ui/themed";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react-native";

/**
 * Função de toast simplificada - foca no texto visível
 */
export function showToast(
  toast: ReturnType<typeof useToast>,
  {
    title,
    type = "success",
  }: {
    title: string;
    type?: "success" | "error" | "warning" | "info";
  }
) {
  // Configurações baseadas no tipo
  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle size={20} color="white" />,
          bgColor: "#22C55E", // green
          action: "success",
        };
      case "error":
        return {
          icon: <XCircle size={20} color="white" />,
          bgColor: "#EF4444", // red
          action: "error",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={20} color="white" />,
          bgColor: "#F59E0B", // amber
          action: "warning",
        };
      case "info":
      default:
        return {
          icon: <Info size={20} color="white" />,
          bgColor: "#3B82F6", // blue
          action: "info",
        };
    }
  };

  const { icon, bgColor, action } = getConfig();

  toast.show({
    placement: "top",
    duration: 3000,
    render: ({ id }) => (
      <Toast
        nativeID={`toast-${id}`}
        action={action as any}
        style={{
          backgroundColor: bgColor,
          borderRadius: 8,
          maxWidth: 400,
          width: "92%",
          alignSelf: "center",
          marginTop: 8,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <View
          style={{
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {icon}
          <Text
            style={{
              marginLeft: 8,
              color: "white",
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            {title}
          </Text>
        </View>
      </Toast>
    ),
  });
}

// Funções auxiliares para diferentes tipos de toast
export function showSuccessToast(
  toast: ReturnType<typeof useToast>,
  title: string
) {
  showToast(toast, { title, type: "success" });
}

export function showErrorToast(
  toast: ReturnType<typeof useToast>,
  title: string
) {
  showToast(toast, { title, type: "error" });
}

export function showWarningToast(
  toast: ReturnType<typeof useToast>,
  title: string
) {
  showToast(toast, { title, type: "warning" });
}

export function showInfoToast(
  toast: ReturnType<typeof useToast>,
  title: string
) {
  showToast(toast, { title, type: "info" });
}
