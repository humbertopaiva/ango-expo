// src/components/custom/section.tsx
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

export function Section({
  title,
  icon,
  actionLabel = "Editar",
  actionIcon,
  onAction,
  children,
  className = "",
}: SectionProps) {
  return (
    <View className={`mb-6 ${className} px-4`}>
      {/* Cabeçalho da seção */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          {icon && <View className="mr-3">{icon}</View>}
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        </View>

        {onAction && (
          <TouchableOpacity
            onPress={onAction}
            className="flex-row items-center py-1 px-3 rounded-full bg-gray-50 border border-gray-200"
          >
            {actionIcon && <View className="mr-2">{actionIcon}</View>}
            <Text className="text-sm text-gray-700">{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Conteúdo da seção */}
      <View>{children}</View>
    </View>
  );
}
