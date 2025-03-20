// Path: src/features/category-page/screens/category-page-content.tsx

import React, { useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { useCategoryPageContext } from "../contexts/use-category-page-context";
import { SubcategoriesTabs } from "../components/subcategories-tabs";
import { CompanyList } from "../components/company-list";
import { Section } from "@/components/custom/section";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { ModalFilter } from "../components/modal-filter";
import { CategoryBreadcrumb } from "../components/category-breadcrumb";
import { CategoryTabs } from "../components/category-tabs";
import { CategoryVitrinesSection } from "../components/category-vitrines-section";

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
          {/* Barra de pesquisa simplificada */}
          <View className="rounded-xl flex-row items-center px-4 mt-4 mx-4 mb-6 bg-white">
            <Search size={20} color="#6B7280" className="ml-4" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-800 fonts-sans placeholder:font-sans"
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

          {/* Tabs para alternar entre Destaques e Empresas */}
          <View className="px-4 mt-6">
            <CategoryTabs
              activeTab={vm.activeTab}
              onTabChange={vm.setActiveTab}
              companyCount={filteredCompanies.length}
              highlightCount={vm.companiesWithVitrine.reduce(
                (acc, company) => acc + company.vitrineItems.length,
                0
              )}
            />
          </View>

          {/* Conteúdo baseado na tab ativa */}
          {vm.activeTab === "highlights" ? (
            <CategoryVitrinesSection
              companiesWithVitrine={vm.companiesWithVitrine}
              isLoading={vm.isLoadingVitrine}
              categoryName={vm.categoryName}
            />
          ) : (
            <View className="mt-2 px-4">
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
          )}
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
