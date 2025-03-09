// Path: src/features/category-page/components/company-list.tsx
import React from "react";
import { View, Text, FlatList, Platform, Image } from "react-native";
import { CategoryCompany } from "../models/category-company";
import { CompanyCard } from "./company-card";
import { SafeMap } from "@/components/common/safe-map";
import { isBusinessOpen } from "../utils/business-hours";

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
  // Ordenar as empresas: primeiro as abertas, depois por data de atualização
  const sortedCompanies = [...companies].sort((a, b) => {
    // Se uma está aberta e outra fechada, a aberta vem primeiro
    const aIsOpen = isBusinessOpen(a.perfil);
    const bIsOpen = isBusinessOpen(b.perfil);

    if (aIsOpen && !bIsOpen) return -1;
    if (!aIsOpen && bIsOpen) return 1;

    // Se ambas têm o mesmo status, ordena por data de atualização (mais recente primeiro)
    const dateA = a.perfil.date_updated
      ? new Date(a.perfil.date_updated).getTime()
      : 0;
    const dateB = b.perfil.date_updated
      ? new Date(b.perfil.date_updated).getTime()
      : 0;
    return dateB - dateA;
  });

  if (isLoading) {
    return (
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
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

  // Versão para web
  if (Platform.OS === "web") {
    return (
      <View className="space-y-4">
        <SafeMap
          data={sortedCompanies}
          renderItem={(company) => (
            <CompanyCard key={company.perfil.id} company={company} />
          )}
        />
      </View>
    );
  }

  // Mobile usa FlatList para melhor performance
  return (
    <FlatList
      data={sortedCompanies}
      keyExtractor={(item) => item.perfil.id}
      renderItem={({ item }) => <CompanyCard company={item} />}
      scrollEnabled={false}
      contentContainerStyle={{ paddingVertical: 4 }}
    />
  );
}
