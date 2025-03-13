// Path: src/features/checkout/components/checkout-stepper.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import {
  Check,
  ShoppingBag,
  User,
  CreditCard,
  CheckCircle,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface CheckoutStepperProps {
  currentStep: number;
  onStepPress?: (step: number) => void;
  allowNavigation?: boolean;
}

export function CheckoutStepper({
  currentStep,
  onStepPress,
  allowNavigation = false,
}: CheckoutStepperProps) {
  const primaryColor = THEME_COLORS.primary;

  // Define os passos
  const steps = [
    { label: "Resumo", icon: ShoppingBag },
    { label: "Dados", icon: User },
    { label: "Pagamento", icon: CreditCard },
    { label: "Confirmação", icon: CheckCircle },
  ];

  // Verifica se o passo está completo
  const isCompleted = (step: number) => step < currentStep;

  // Verifica se o passo está ativo
  const isActive = (step: number) => step === currentStep;

  return (
    <View className="px-4 py-3 bg-white border-b border-gray-200">
      <HStack className="justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const completed = isCompleted(index);
          const active = isActive(index);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (allowNavigation && onStepPress && (completed || active)) {
                  onStepPress(index);
                }
              }}
              disabled={!(allowNavigation && (completed || active))}
              className="items-center"
              style={{ opacity: completed || active ? 1 : 0.5 }}
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                  active ? "border border-primary-500" : ""
                }`}
                style={{
                  backgroundColor: completed
                    ? primaryColor
                    : active
                    ? `${primaryColor}10`
                    : "#f3f4f6",
                }}
              >
                {completed ? (
                  <Check size={16} color="white" />
                ) : (
                  <StepIcon
                    size={16}
                    color={active ? primaryColor : "#9CA3AF"}
                  />
                )}
              </View>
              <Text
                className={`text-xs ${
                  active
                    ? "font-medium text-primary-600"
                    : completed
                    ? "font-medium text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </HStack>
    </View>
  );
}
