// Path: src/components/custom/section.tsx
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SectionProps {
  title?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
  paddingX?: number;
}

export function Section({
  title,
  icon,
  actionLabel = "Editar",
  actionIcon,
  onAction,
  children,
  className = "",
  paddingX = 8,
}: SectionProps) {
  return (
    <View
      className={`${className} flex-1`}
      style={{ paddingHorizontal: paddingX }}
    >
      {/* Cabeçalho da seção */}
      {title && (
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            {icon && <View className="mr-3">{icon}</View>}
            <Text className="text-xl font-semibold text-gray-800">{title}</Text>
          </View>
        </View>
      )}

      {/* Conteúdo da seção */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
