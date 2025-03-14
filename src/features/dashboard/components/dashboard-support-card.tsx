// Path: src/features/dashboard/components/dashboard-support-card.tsx
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { HelpCircle } from "lucide-react-native";
import { HStack } from "@gluestack-ui/themed";

interface DashboardSupportCardProps {
  onPress: () => void;
  primaryColor: string;
}

export function DashboardSupportCard({
  onPress,
  primaryColor,
}: DashboardSupportCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-primary-100 rounded-xl overflow-hidden shadow-sm mb-6"
      onPress={onPress}
    >
      <HStack space="md" alignItems="center" className="p-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${primaryColor}30` }}
        >
          <HelpCircle size={20} color={primaryColor} />
        </View>

        <View className="flex-1">
          <Text className="text-lg font-medium text-primary-500">
            Central de Suporte
          </Text>
          <Text className="text-md font-sans text-gray-700">
            Dúvidas? Nossa equipe está pronta para ajudar
          </Text>
        </View>
      </HStack>
    </TouchableOpacity>
  );
}
