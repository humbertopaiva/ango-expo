// components/custom/ModalForm.tsx
import React from "react";
import { View, ScrollView, Text } from "react-native";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  scrollable?: boolean;
  maxWidth?: number | "auto" | `${number}%`;
}

export function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  isLoading = false,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  scrollable = true,
  maxWidth,
}: ModalFormProps) {
  const Content = scrollable ? ScrollView : View;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        className="bg-white"
        style={maxWidth ? { maxWidth } : undefined}
      >
        <ModalHeader className="flex flex-col">
          <Heading size="lg">{title}</Heading>
          {subtitle && (
            <Text className="text-sm text-gray-500">{subtitle}</Text>
          )}
        </ModalHeader>

        <Content className="p-4">
          <View className="gap-4">
            {children}

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
                onPress={onSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                <ButtonText>
                  {isLoading ? "Salvando..." : submitLabel}
                </ButtonText>
              </Button>
            </View>
          </View>
        </Content>
      </ModalContent>
    </Modal>
  );
}
