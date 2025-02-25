// src/features/categories/components/categories-list.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { MoreHorizontal } from "lucide-react-native";
import { Category } from "../models/category";

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
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="p-6 bg-white rounded-lg">
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
                <View
                  className={`px-2 py-1 rounded-full ${
                    category.categoria_ativa ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      category.categoria_ativa
                        ? "text-green-800"
                        : "text-gray-800"
                    }
                  >
                    {category.categoria_ativa ? "Ativa" : "Inativa"}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => onEdit(category)} className="p-2">
              <MoreHorizontal size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </View>
  );
}
