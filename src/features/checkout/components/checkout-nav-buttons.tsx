// Path: src/features/checkout/components/checkout-nav-buttons.tsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button, HStack } from "@gluestack-ui/themed";
import { Check } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { Platform } from "react-native";

interface CheckoutNavButtonsProps {
  currentStep: number;
  isValid: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onFinish: () => void;
  isProcessing: boolean;
}

export function CheckoutNavButtons({
  currentStep,
  isValid,
  onNext,
  onPrev,
  isLastStep,
  onFinish,
  isProcessing,
}: CheckoutNavButtonsProps) {
  const primaryColor = THEME_COLORS.primary;

  return (
    <View style={styles.container}>
      <HStack space="md" style={styles.buttonContainer}>
        {currentStep > 0 && (
          <Button
            onPress={onPrev}
            variant="outline"
            className="flex-1"
            isDisabled={isProcessing}
            style={styles.button}
          >
            <Text className="font-medium">Voltar</Text>
          </Button>
        )}

        {isLastStep ? (
          <Button
            onPress={onFinish}
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: primaryColor },
            ]}
            className="flex-1"
            isDisabled={isProcessing || !isValid}
          >
            {isProcessing ? (
              <HStack space="sm">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-medium">Processando...</Text>
              </HStack>
            ) : (
              <HStack space="sm">
                <Check size={18} color="white" />
                <Text className="text-white font-medium">Finalizar Pedido</Text>
              </HStack>
            )}
          </Button>
        ) : (
          <Button
            onPress={onNext}
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: primaryColor },
            ]}
            className="flex-1"
            isDisabled={isProcessing || !isValid}
          >
            <Text className="text-white font-medium">Continuar</Text>
          </Button>
        )}
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    borderRadius: 8,
  },
});
