// Path: src/features/category-page/components/company-list.tsx
import React from "react";
import { View, Text, FlatList, Platform } from "react-native";
import { CategoryCompany } from "../models/category-company";
import { CompanyCard } from "./company-card";
import { SafeMap } from "@/components/common/safe-map";
import { isBusinessOpen } from "../utils/business-hours";
import { EmptyCategory } from "./empty-category";
import { THEME_COLORS } from "@/src/styles/colors";

interface CompanyListProps {
  companies: CategoryCompany[];
  isLoading: boolean;
  searchTerm?: string;
  categoryName: string;
}

export function CompanyList({
  companies,
  isLoading,
  searchTerm = "",
  categoryName,
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

  // Separar empresas abertas e fechadas para destaque visual
  const openCompanies = sortedCompanies.filter((comp) =>
    isBusinessOpen(comp.perfil)
  );
  const closedCompanies = sortedCompanies.filter(
    (comp) => !isBusinessOpen(comp.perfil)
  );

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
    if (searchTerm) {
      return (
        <View className="items-center justify-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Text className="text-lg font-medium text-gray-700 mt-4 text-center">
            Nenhum estabelecimento encontrado
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Não encontramos resultados para "{searchTerm}"
          </Text>
        </View>
      );
    }

    return <EmptyCategory categoryName={categoryName} />;
  }

  // Componente para exibir o cabeçalho da seção
  const SectionHeader = ({
    title,
    count,
    isOpen,
  }: {
    title: string;
    count: number;
    isOpen: boolean;
  }) => (
    <View className="mb-3 pb-1 border-b border-gray-100">
      <View className="flex-row items-center">
        <View
          className={`w-3 h-3 mr-2 rounded-full ${
            isOpen ? "bg-green-500" : "bg-gray-500"
          }`}
        />
        <Text className="text-base font-medium text-gray-700">{title}</Text>
        <Text className="ml-2 text-sm text-gray-500">({count})</Text>
      </View>
    </View>
  );

  // Renderizar componentes
  const renderCompanies = (companyList: CategoryCompany[]) => {
    return companyList.map((company) => (
      <CompanyCard key={company.perfil.id} company={company} />
    ));
  };

  // Versão para web e mobile
  return (
    <View className="space-y-6">
      {openCompanies.length > 0 && (
        <View className="mb-2">
          <SectionHeader
            title="Aberto agora"
            count={openCompanies.length}
            isOpen={true}
          />
          {renderCompanies(openCompanies)}
        </View>
      )}

      {closedCompanies.length > 0 && (
        <View>
          <SectionHeader
            title="Fechado"
            count={closedCompanies.length}
            isOpen={false}
          />
          {renderCompanies(closedCompanies)}
        </View>
      )}
    </View>
  );
}
