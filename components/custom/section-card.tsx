// src/components/custom/section-card.tsx
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  children: ReactNode;
}

export function SectionCard({
  title,
  icon,
  onPress,
  actionLabel = "Editar",
  actionIcon,
  onAction,
  children,
}: SectionCardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Card className="bg-white mb-6 rounded-xl overflow-hidden shadow-sm">
      {/* Cabeçalho */}
      <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">
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

      {/* Conteúdo */}
      <View className="p-2">{children}</View>
    </Card>
  );
}
