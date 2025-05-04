// Path: src/features/checkout/components/checkout-stepper.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import {
  Check,
  ShoppingBag,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface CheckoutStepperProps {
  currentStep: number;
  onStepPress?: (step: number) => void;
  allowNavigation?: boolean;
  stepsValidation?: boolean[];
}

export function CheckoutStepper({
  currentStep,
  onStepPress,
  allowNavigation = true,
  stepsValidation = [true, false, false, false],
}: CheckoutStepperProps) {
  const primaryColor = THEME_COLORS.primary;

  // Animação para progresso
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Calcular a largura da barra de progresso com base no passo atual
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: currentStep / 3, // 4 passos total, normalizado para 0-1
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnimation]);

  // Define os passos
  const steps = [
    { label: "Resumo", icon: ShoppingBag },
    { label: "Dados", icon: User },
    { label: "Pagamento", icon: CreditCard },
    { label: "Confirmação", icon: CheckCircle },
  ];

  // Verifica se o passo está completo
  const isCompleted = (step: number) =>
    step < currentStep && stepsValidation[step];

  // Verifica se o passo está ativo
  const isActive = (step: number) => step === currentStep;

  // Verifica se o passo está validado
  const isValid = (step: number) => stepsValidation[step];

  // Verifica se o passo está disponível para navegação
  const isNavigable = (step: number) => step <= currentStep;

  return (
    <View className="px-4 py-3 bg-white border-b border-gray-200">
      {/* Barra de progresso animada */}
      <View className="h-1 bg-gray-200 mb-3 rounded-full overflow-hidden">
        <Animated.View
          className="h-full"
          style={{
            width: progressAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: primaryColor,
          }}
        />
      </View>

      <HStack className="justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const completed = isCompleted(index);
          const active = isActive(index);
          const valid = isValid(index);
          const navigable = isNavigable(index);

          // Determinar a cor do ícone
          let iconColor = "#9CA3AF"; // Cinza para passos futuros
          let bgColor = "#f3f4f6"; // Fundo cinza claro para passos futuros

          if (completed) {
            iconColor = "white";
            bgColor = primaryColor;
          } else if (active) {
            iconColor = valid ? primaryColor : "#F59E0B"; // Amarelo para inválido
            bgColor = valid ? `${primaryColor}10` : "#FEF3C7"; // Fundo amarelo claro para inválido
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (allowNavigation && onStepPress && navigable) {
                  onStepPress(index);
                }
              }}
              disabled={!(allowNavigation && navigable)}
              className="items-center"
              style={{ opacity: navigable ? 1 : 0.5 }}
              activeOpacity={navigable ? 0.7 : 1}
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                  navigable ? "border" : ""
                } ${
                  active
                    ? valid
                      ? "border-primary-500"
                      : "border-amber-500"
                    : navigable
                    ? "border-gray-300"
                    : ""
                }`}
                style={{
                  backgroundColor: bgColor,
                }}
              >
                {completed ? (
                  <Check size={16} color="white" />
                ) : active && !valid ? (
                  <AlertCircle size={16} color="#F59E0B" />
                ) : (
                  <StepIcon size={16} color={iconColor} />
                )}
              </View>
              <Text
                className={`text-xs ${
                  active
                    ? valid
                      ? "font-medium text-primary-600"
                      : "font-medium text-amber-600"
                    : completed
                    ? "font-medium text-gray-800"
                    : navigable
                    ? "text-gray-700"
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
