// src/features/delivery/components/delivery-subcategories-tabs.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { DeliverySubcategory } from "../models/delivery-subcategory";
import { UtensilsCrossed, LayoutGrid } from "lucide-react-native";

interface DeliverySubcategoriesTabsProps {
  subcategories: DeliverySubcategory[];
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string | null) => void;
  isLoading: boolean;
}

export function DeliverySubcategoriesTabs({
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  isLoading,
}: DeliverySubcategoriesTabsProps) {
  if (isLoading) {
    return (
      <View className="flex-row gap-2 px-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <View
            key={`skeleton-${i}`}
            className="h-10 w-32 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </View>
    );
  }

  // Filtrando subcategorias que têm id e slug definidos
  const validSubcategories = subcategories.filter(
    (sub) => !!sub && !!sub.id && !!sub.slug
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 mb-6"
    >
      {/* Opção "Todos" */}
      <TouchableOpacity
        key="subcategory-all"
        onPress={() => onSelectSubcategory(null)}
        className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
          selectedSubcategory === null
            ? "bg-primary-500"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <UtensilsCrossed
          size={20}
          color={selectedSubcategory === null ? "white" : "#374151"}
        />
        <Text
          className={`ml-2 font-medium ${
            selectedSubcategory === null ? "text-white" : "text-gray-700"
          }`}
        >
          Todos
        </Text>
      </TouchableOpacity>

      {/* Categorias - agora com filtro para garantir itens válidos */}
      {validSubcategories.map((subcategory, index) => (
        <TouchableOpacity
          key={`subcategory-${subcategory.id || index}`} // Usar index como fallback se id não estiver disponível
          onPress={() => onSelectSubcategory(subcategory.slug)}
          className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
            selectedSubcategory === subcategory.slug
              ? "bg-primary-500"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <LayoutGrid
            size={20}
            color={
              selectedSubcategory === subcategory.slug ? "white" : "#374151"
            }
          />
          <Text
            className={`ml-2 font-medium ${
              selectedSubcategory === subcategory.slug
                ? "text-white"
                : "text-gray-700"
            }`}
          >
            {subcategory.nome || "Categoria"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
