// src/components/custom/data-list.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { AlertCircle } from "lucide-react-native";

interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  error?: string;
  loadingItemCount?: number;
  className?: string;
  renderSkeleton?: () => React.ReactNode;
}

export function DataList<T>({
  data,
  renderItem,
  isLoading = false,
  emptyMessage = "Nenhum item encontrado",
  emptyIcon,
  error,
  loadingItemCount = 3,
  className = "",
  renderSkeleton,
}: DataListProps<T>) {
  // Loading state
  if (isLoading) {
    // Usar o renderSkeleton personalizado, se fornecido
    if (renderSkeleton) {
      return renderSkeleton();
    }

    // Fallback para skeleton padrão
    return (
      <View className={`gap-3 ${className}`}>
        {Array.from({ length: loadingItemCount }).map((_, i) => (
          <View key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <View className="p-6 items-center">
          <AlertCircle size={32} color="#EF4444" />
          <Text className="mt-2 text-red-500 text-center">{error}</Text>
        </View>
      </Card>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className={className}>
        <View className="p-6 items-center">
          {emptyIcon || <AlertCircle size={32} color="#6B7280" />}
          <Text className="mt-2 text-gray-500 text-center">{emptyMessage}</Text>
        </View>
      </Card>
    );
  }

  // Data state
  return (
    <ScrollView
      className={`gap-3 ${className}`}
      showsVerticalScrollIndicator={false}
    >
      {data.map((item, index) => (
        <View key={index} className="mb-2">
          {renderItem(item, index)}
        </View>
      ))}
    </ScrollView>
  );
}
