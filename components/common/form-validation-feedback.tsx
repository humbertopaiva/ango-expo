// Path: src/components/common/form-validation-feedback.tsx

import React from "react";
import { View, Text } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { CheckCircle, AlertCircle, Info } from "lucide-react-native";

interface FormValidationFeedbackProps {
  isValid: boolean;
  isPartiallyValid?: boolean;
  validMessage?: string;
  invalidMessage?: string;
  partialMessage?: string;
  primaryColor?: string;
}

/**
 * Componente que exibe feedback visual sobre a validação de um formulário
 */
export function FormValidationFeedback({
  isValid,
  isPartiallyValid = false,
  validMessage = "Pronto para continuar",
  invalidMessage = "Preencha todos os campos obrigatórios",
  partialMessage = "Continue preenchendo os campos obrigatórios",
  primaryColor = "#F4511E",
}: FormValidationFeedbackProps) {
  // Determinar o estado atual do formulário
  const status = isValid ? "valid" : isPartiallyValid ? "partial" : "invalid";

  // Configurações visuais baseadas no estado
  const config = {
    valid: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      message: validMessage,
      icon: <CheckCircle size={18} color="#10B981" />,
    },
    partial: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      message: partialMessage,
      icon: <Info size={18} color="#F59E0B" />,
    },
    invalid: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      message: invalidMessage,
      icon: <AlertCircle size={18} color="#EF4444" />,
    },
  };

  const currentConfig = config[status];

  return (
    <View
      className={`mt-6 p-3 rounded-lg ${currentConfig.bgColor} border ${currentConfig.borderColor}`}
    >
      <HStack space="sm" alignItems="center">
        {currentConfig.icon}
        <Text className={`font-medium ${currentConfig.textColor}`}>
          {currentConfig.message}
        </Text>
      </HStack>
    </View>
  );
}
