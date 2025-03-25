// Path: src/features/support/components/faq-header.tsx
import React from "react";
import { View, Text } from "react-native";
import { HelpCircle } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

export function FaqHeader() {
  return (
    <View className="flex-row items-center mb-3">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${THEME_COLORS.primary}15` }}
      >
        <HelpCircle size={20} color={THEME_COLORS.primary} />
      </View>
      <View>
        <Text className="text-lg font-semibold text-gray-800">
          Perguntas Frequentes
        </Text>
        <Text className="text-sm text-gray-500">
          Selecione uma pergunta para responder
        </Text>
      </View>
    </View>
  );
}
