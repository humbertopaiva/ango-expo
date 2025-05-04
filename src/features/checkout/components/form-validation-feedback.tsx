// Path: src/components/common/form-validation-feedback.tsx

import React from "react";
import { View, Text } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { Check, AlertCircle, Clock } from "lucide-react-native";

interface FormValidationFeedbackProps {
  isValid: boolean;
  isPartiallyValid?: boolean;
  validMessage: string;
  invalidMessage: string;
  partialMessage?: string;
  primaryColor: string;
}

export function FormValidationFeedback({
  isValid,
  isPartiallyValid,
  validMessage,
  invalidMessage,
  partialMessage,
  primaryColor,
}: FormValidationFeedbackProps) {
  if (isValid) {
    return (
      <View className="p-3 rounded-lg mt-2 bg-green-50 border border-green-100">
        <HStack space="sm" alignItems="center">
          <Check size={18} color="#22C55E" />
          <Text className="text-sm text-green-700">{validMessage}</Text>
        </HStack>
      </View>
    );
  }

  if (isPartiallyValid) {
    return (
      <View className="p-3 rounded-lg mt-2 bg-blue-50 border border-blue-100">
        <HStack space="sm" alignItems="center">
          <Clock size={18} color="#3B82F6" />
          <Text className="text-sm text-blue-700">
            {partialMessage || "Continue preenchendo os campos"}
          </Text>
        </HStack>
      </View>
    );
  }

  return (
    <View className="p-3 rounded-lg mt-2 bg-amber-50 border border-amber-100">
      <HStack space="sm" alignItems="center">
        <AlertCircle size={18} color="#F59E0B" />
        <Text className="text-sm text-amber-700">{invalidMessage}</Text>
      </HStack>
    </View>
  );
}
