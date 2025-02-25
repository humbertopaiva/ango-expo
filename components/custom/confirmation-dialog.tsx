// src/components/custom/confirmation-dialog.tsx
import React from "react";
import { View, Text } from "react-native";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react-native";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  variant = "danger",
}: ConfirmationDialogProps) {
  // Configurações de estilo baseadas na variante
  const variantConfig = {
    danger: {
      icon: <AlertTriangle size={32} color="#EF4444" />,
      buttonClass: "bg-red-500",
      textClass: "text-red-600",
    },
    warning: {
      icon: <AlertTriangle size={32} color="#F59E0B" />,
      buttonClass: "bg-yellow-500",
      textClass: "text-yellow-600",
    },
    info: {
      icon: <AlertTriangle size={32} color="#3B82F6" />,
      buttonClass: "bg-blue-500",
      textClass: "text-blue-600",
    },
  };

  const config = variantConfig[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-white" style={{ maxWidth: 400 }}>
        <View className="p-4">
          <View className="items-center mb-4">
            {config.icon}
            <Text className="text-lg font-semibold mt-2">{title}</Text>
            <Text className="text-center text-gray-600 mt-2">{message}</Text>
          </View>

          <View className="flex-row justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              <ButtonText>{cancelLabel}</ButtonText>
            </Button>
            <Button
              onPress={onConfirm}
              disabled={isLoading}
              className={`flex-1 ${config.buttonClass}`}
            >
              <ButtonText>
                {isLoading ? "Processando..." : confirmLabel}
              </ButtonText>
            </Button>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
}
