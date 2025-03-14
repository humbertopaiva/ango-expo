// Path: src/features/categories/components/categories-list.tsx
import React, { useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Category } from "../models/category";
import { Edit, Trash2, Grid, Check, X } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { CategorySkeletonList } from "./category-skeleton";

interface CategoriesListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onItemPress?: (category: Category) => void;
}

export function CategoriesList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onItemPress,
}: CategoriesListProps) {
  // Ordena as categorias: ativas primeiro, depois inativas
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      // Primeiro ordenar por status (ativas primeiro)
      if (a.categoria_ativa && !b.categoria_ativa) return -1;
      if (!a.categoria_ativa && b.categoria_ativa) return 1;

      // Se ambas tiverem o mesmo status, ordenar por nome
      return a.nome.localeCompare(b.nome);
    });
  }, [categories]);

  // Renderiza o item de categoria com botões de ação na mesma linha
  const renderCategoryItem = ({ item }: { item: Category }) => {
    return (
      <TouchableOpacity
        onPress={() => onItemPress && onItemPress(item)}
        activeOpacity={onItemPress ? 0.7 : 1}
        className="bg-white p-4 rounded-lg border border-gray-200 mb-3 shadow-sm"
      >
        <View className="flex-row items-center">
          {/* Informações da categoria */}
          <View className="flex-1">
            <Text
              className="font-medium text-md text-gray-800"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.nome}
            </Text>

            {/* Badge de status */}
            <View
              className={`flex-row items-center mt-1 px-2 py-1 rounded-full self-start ${
                item.categoria_ativa ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {item.categoria_ativa ? (
                <Check size={12} color="#10B981" />
              ) : (
                <X size={12} color="#EF4444" />
              )}
              <Text
                className={`text-xs font-medium ml-1 ${
                  item.categoria_ativa ? "text-green-700" : "text-red-700"
                }`}
              >
                {item.categoria_ativa ? "Ativa" : "Inativa"}
              </Text>
            </View>
          </View>

          {/* Botões de ação */}
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => onEdit(item)}
              className="bg-gray-100 p-2 rounded-md mr-2"
            >
              <Edit size={18} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(item)}
              className="bg-red-100 p-2 rounded-md"
            >
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Mensagem para lista vazia
  const renderEmptyList = () => (
    <View className="py-8 items-center justify-center">
      <Text className="text-gray-500 text-center">
        Nenhuma categoria encontrada. Crie uma nova categoria para começar.
      </Text>
    </View>
  );

  // Renderiza indicador de carregamento
  if (isLoading) {
    return <CategorySkeletonList count={3} />;
  }

  return (
    <FlatList
      data={sortedCategories}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      contentContainerStyle={{ paddingVertical: 12 }}
      ListEmptyComponent={renderEmptyList}
      showsVerticalScrollIndicator={false}
    />
  );
}
