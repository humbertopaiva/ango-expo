// src/features/categories/components/categories-list.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Edit, Trash } from "lucide-react-native";
import { Category } from "../models/category";
import { StatusBadge } from "@/components/custom/status-badge";

interface CategoriesListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesList({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesListProps) {
  if (isLoading) {
    return (
      <View className="gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <View key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="p-6 bg-white rounded-lg mt-6">
        <Text className="text-gray-500 text-center">
          Nenhuma categoria encontrada. Crie uma nova categoria para começar.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {categories.map((category) => (
        <Card key={category.id} className="p-4 bg-white">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-medium text-base">{category.nome}</Text>
              <View className="flex-row items-center mt-1">
                <StatusBadge
                  status={category.categoria_ativa ? "ativa" : "inativa"}
                />
              </View>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                onPress={() => onEdit(category)}
                className="p-2 mr-2"
              >
                <Edit size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(category)}
                className="p-2"
              >
                <Trash size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}
