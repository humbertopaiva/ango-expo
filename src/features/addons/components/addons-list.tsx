// Path: src/features/addons/components/addons-list.tsx
import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

import { AddonsList as AddonsListType } from "../models/addon";
import { Plus } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { AddonCard } from "./addon-card";

interface AddonsListProps {
  addonsList: AddonsListType[];
  isLoading: boolean;
  onEdit: (addon: AddonsListType) => void;
  onDelete: (addon: AddonsListType) => void;
  onView: (addon: AddonsListType) => void;
  emptyMessage?: string;
}

export function AddonsList({
  addonsList,
  isLoading,
  onEdit,
  onDelete,
  onView,
  emptyMessage = "Nenhuma lista de adicionais encontrada. Crie uma nova lista para começar.",
}: AddonsListProps) {
  if (isLoading) {
    return (
      <View className="p-4 items-center justify-center">
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        <Text className="mt-2 text-gray-500">
          Carregando listas de adicionais...
        </Text>
      </View>
    );
  }

  if (addonsList.length === 0) {
    return (
      <View className="bg-white p-6 rounded-lg items-center justify-center">
        <Plus size={40} color="#9CA3AF" />
        <Text className="text-lg font-medium text-gray-500 mt-2">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={addonsList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AddonCard
          addon={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onView={() => onView(item)}
        />
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}
