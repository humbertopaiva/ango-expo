// Path: src/features/category-page/screens/category-page-content.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useCategoryPageContext } from "../contexts/use-category-page-context";
import { SubcategoriesTabs } from "../components/subcategories-tabs";
import { CompanyList } from "../components/company-list";

import { Section } from "@/components/custom/section";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { HStack } from "@gluestack-ui/themed";
import { ModalFilter } from "../components/modal-filter";
import { CategoryBreadcrumb } from "../components/category-breadcrumb";

interface CategoryPageContentProps {
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
}

export function CategoryPageContent({
  showFilterModal,
  setShowFilterModal,
}: CategoryPageContentProps) {
  const vm = useCategoryPageContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectSubcategory = (slug: string | null) => {
    vm.setSelectedSubcategory(slug);
  };

  // Filtragem de empresas baseada no termo de busca
  const filteredCompanies = vm.companies.filter((company) =>
    company.perfil.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb de navegação */}
        <View className="bg-white py-1">
          <CategoryBreadcrumb categoryName={vm.categoryName} />
        </View>

        <Section>
          {/* Barra de pesquisa simplificada - sem botão de filtro */}
          <View className="bg-gray-100 rounded-xl flex-row items-center px-3 mt-4 mx-4 mb-6">
            <Search size={20} color="#6B7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-800"
              placeholder="Buscar estabelecimentos..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Subcategorias */}
          <SubcategoriesTabs
            subcategories={vm.subcategories}
            selectedSubcategory={vm.selectedSubcategory}
            onSelectSubcategory={handleSelectSubcategory}
            isLoading={vm.isLoading}
          />

          {/* Lista de Empresas */}
          <View className="mt-6 px-4">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                {filteredCompanies.length}{" "}
                {filteredCompanies.length === 1
                  ? "estabelecimento"
                  : "estabelecimentos"}{" "}
                encontrados
              </Text>
            </View>
            <CompanyList
              companies={filteredCompanies}
              isLoading={vm.isLoading}
              searchTerm={searchTerm}
              categoryName={vm.categoryName}
            />
          </View>
        </Section>
      </ScrollView>

      {/* Modal de Filtro */}
      <ModalFilter
        isVisible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        subcategories={vm.subcategories}
        selectedSubcategory={vm.selectedSubcategory}
        onSelectSubcategory={handleSelectSubcategory}
      />
    </SafeAreaView>
  );
}
