// components/common/simplified-toast.tsx
import React from "react";
import { View, Text } from "react-native";
import { useToast, Toast, ToastTitle } from "@gluestack-ui/themed";
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

export function showInfoToast(
  toast: ReturnType<typeof useToast>,
  title: string
) {
  showToast(toast, { title, type: "info" });
}

/**
 * Exibe um toast de erro
 * @param toast Hook useToast() do Gluestack UI
 * @param message Mensagem de erro a ser exibida
 */
export function showErrorToast(toast: any, message: string) {
  toast.show({
    placement: "top",
    render: ({ id }: { id: string }) => {
      return (
        <Toast nativeID={id} action="error" variant="accent">
          <ToastTitle color="$error800">{message}</ToastTitle>
        </Toast>
      );
    },
  });
}

/**
 * Exibe um toast de sucesso
 * @param toast Hook useToast() do Gluestack UI
 * @param message Mensagem de sucesso a ser exibida
 */
export function showSuccessToast(toast: any, message: string) {
  toast.show({
    placement: "top",
    render: ({ id }: { id: string }) => {
      return (
        <Toast nativeID={id} action="success" variant="accent">
          <ToastTitle color="$success800">{message}</ToastTitle>
        </Toast>
      );
    },
  });
}

/**
 * Exibe um toast de aviso
 * @param toast Hook useToast() do Gluestack UI
 * @param message Mensagem de aviso a ser exibida
 */
export function showWarningToast(toast: any, message: string) {
  toast.show({
    placement: "top",
    render: ({ id }: { id: string }) => {
      return (
        <Toast nativeID={id} action="warning" variant="accent">
          <ToastTitle color="$warning800">{message}</ToastTitle>
        </Toast>
      );
    },
  });
}

/**
 * Verifica erros em um formulário e exibe um toast se necessário
 * @param toast Hook useToast() do Gluestack UI
 * @param errors Objeto de erros do react-hook-form
 * @param options Opções de customização
 * @returns true se o formulário é válido, false caso contrário
 */
export function validateFormWithToast(
  toast: any,
  errors: Record<string, any>,
  options: {
    errorMessage?: string;
    fieldLabels?: Record<string, string>;
    maxFieldsToShow?: number;
  } = {}
): boolean {
  const {
    errorMessage = "Por favor, revise as informações",
    fieldLabels = {},
    maxFieldsToShow = 3,
  } = options;

  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    const errorFields = Object.keys(errors);
    let fullMessage = errorMessage;

    if (errorFields.length > 0) {
      const fieldsToShow = errorFields.slice(0, maxFieldsToShow);
      const formattedFields = fieldsToShow
        .map((field) => fieldLabels[field] || field)
        .join(", ");

      if (errorFields.length <= maxFieldsToShow) {
        fullMessage += `. Campos: ${formattedFields}`;
      } else {
        fullMessage += `. ${fieldsToShow.length} de ${errorFields.length} campos: ${formattedFields}...`;
      }
    }

    showErrorToast(toast, fullMessage);
    return false;
  }

  return true;
}
