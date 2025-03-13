// Path: src/components/ui/radio-option-button.tsx
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { HStack, Radio, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface RadioOptionButtonProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  primaryColor?: string;
  className?: string;
}

export function RadioOptionButton({
  value,
  label,
  description,
  icon,
  isSelected,
  onPress,
  primaryColor = THEME_COLORS.primary,
  className = "",
}: RadioOptionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 border rounded-lg mb-3 ${
        isSelected ? `border-primary-500 bg-primary-50` : "border-gray-200"
      } ${className}`}
    >
      <HStack space="md" alignItems="center">
        {icon && (
          <View
            className="h-10 w-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: isSelected ? `${primaryColor}20` : "#f3f4f6",
            }}
          >
            {icon}
          </View>
        )}

        <VStack space="xs" flex={1}>
          <Text className="font-medium text-gray-800">{label}</Text>
          {description && (
            <Text className="text-sm text-gray-500">{description}</Text>
          )}
        </VStack>

        <Radio value={value} aria-label={label} />
      </HStack>
    </TouchableOpacity>
  );
}
