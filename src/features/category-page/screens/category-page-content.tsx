// Path: src/features/category-page/screens/category-page-content.tsx

import React, { useState, useEffect } from "react";
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
import { EmptyCategory } from "../components/empty-category";
import { Box } from "@/components/ui/box";

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

  // Verificar se há vitrines disponíveis
  const hasVitrines = vm.companiesWithVitrine.length > 0;

  // Ajustar a aba ativa quando não houver vitrines
  useEffect(() => {
    if (!hasVitrines && vm.activeTab === "highlights") {
      vm.setActiveTab("companies");
    }
  }, [hasVitrines, vm.activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Section paddingX={0}>
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
          <Box className="px-4">
            <SubcategoriesTabs
              subcategories={vm.subcategories}
              selectedSubcategory={vm.selectedSubcategory}
              onSelectSubcategory={handleSelectSubcategory}
              isLoading={vm.isLoading}
            />
          </Box>

          {/* Tabs para alternar entre Destaques e Empresas - só mostra se houver vitrines */}
          <View className="px-4 mt-6">
            <CategoryTabs
              activeTab={vm.activeTab}
              onTabChange={vm.setActiveTab}
              companyCount={filteredCompanies.length}
              highlightCount={vm.showcaseProducts.length}
              hasVitrines={hasVitrines}
              vitrinesCount={vm.companiesWithVitrine.length} // Adicionando a contagem de empresas com vitrine
            />
          </View>

          {/* Conteúdo baseado na tab ativa */}
          {vm.activeTab === "highlights" && hasVitrines ? (
            <CategoryVitrinesSection
              companiesWithVitrine={vm.companiesWithVitrine}
              isLoading={vm.isLoadingVitrine}
              categoryName={vm.categoryName}
            />
          ) : (
            <View className="mt-2 px-4">
              {!vm.isLoading && (
                <View className="mb-4">
                  <Text className="text-lg font-semibold text-gray-800">
                    {filteredCompanies.length}{" "}
                    {filteredCompanies.length === 1
                      ? "estabelecimento"
                      : "estabelecimentos"}{" "}
                    encontrados
                  </Text>
                </View>
              )}

              {/* Se não houver empresas e não estiver carregando, mostra componente de categoria vazia */}
              {filteredCompanies.length === 0 && !vm.isLoading ? (
                <EmptyCategory categoryName={vm.categoryName} />
              ) : (
                <CompanyList
                  companies={filteredCompanies}
                  isLoading={vm.isLoading}
                  searchTerm={searchTerm}
                  categoryName={vm.categoryName}
                />
              )}
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
