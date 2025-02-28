// Path: src/components/custom/section.tsx
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
    <View className={`mb-6 ${className} px-4 pt-6 pb-16 flex-1`}>
      {/* Cabeçalho da seção */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          {icon && <View className="mr-3">{icon}</View>}
          <Text className="text-xl font-semibold text-gray-800">{title}</Text>
        </View>
      </View>

      {/* Conteúdo da seção */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
