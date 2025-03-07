// Path: src/features/category-page/components/company-list.tsx (atualizado sem animações)
import React from "react";
import { View, Text, FlatList, Platform, Image } from "react-native";
import { CategoryCompany } from "../models/category-company";

import { SafeMap } from "@/components/common/safe-map";
import { CompanyCard } from "./company-card";

interface CompanyListProps {
  companies: CategoryCompany[];
  isLoading: boolean;
  searchTerm?: string;
}

export function CompanyList({
  companies,
  isLoading,
  searchTerm = "",
}: CompanyListProps) {
  if (isLoading) {
    return (
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </View>
    );
  }

  if (companies.length === 0) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-lg font-medium text-gray-700 mt-4 text-center">
          Nenhuma empresa encontrada
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          {searchTerm
            ? `Não encontramos resultados para "${searchTerm}"`
            : "Não há empresas disponíveis para esta categoria"}
        </Text>
      </View>
    );
  }

  // Versão simplificada sem animações para web
  if (Platform.OS === "web") {
    return (
      <View className="space-y-4">
        <SafeMap
          data={companies}
          renderItem={(company) => (
            <View key={company.id} className="mb-4">
              <CompanyCard company={company} />
            </View>
          )}
        />
      </View>
    );
  }

  // Mobile usa FlatList para melhor performance
  return (
    <FlatList
      data={companies}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CompanyCard company={item} />}
      ItemSeparatorComponent={() => <View className="h-4" />}
      scrollEnabled={false}
      contentContainerStyle={{ paddingVertical: 4 }}
    />
  );
}
