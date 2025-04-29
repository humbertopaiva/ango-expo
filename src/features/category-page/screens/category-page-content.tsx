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
import { CategoryHeader } from "../components/category-header";
import { useCategoryDetails } from "../hooks/use-category-details";
import { useLocalSearchParams } from "expo-router";

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
  const { categorySlug } = useLocalSearchParams<{ categorySlug: string }>();
  const { categoryName, categoryImage, isLoading } = useCategoryDetails(
    categorySlug as string
  );

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
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <CategoryHeader
          categoryName={categoryName}
          categoryImage={categoryImage}
          isLoading={isLoading}
          onFilterPress={() => setShowFilterModal(true)}
        />

        <Section paddingX={0} className="">
          {/* Subcategorias */}
          <Box className="pl-4">
            <SubcategoriesTabs
              subcategories={vm.subcategories}
              selectedSubcategory={vm.selectedSubcategory}
              onSelectSubcategory={handleSelectSubcategory}
              isLoading={vm.isLoading}
              onFilterPress={() => setShowFilterModal(true)}
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
          {vm.activeTab === "highlights" && hasVitrines && (
            <CategoryVitrinesSection
              companiesWithVitrine={vm.companiesWithVitrine}
              isLoading={vm.isLoadingVitrine}
              categoryName={vm.categoryName}
            />
          )}
          {filteredCompanies.length === 0 && !vm.isLoading ? (
            <EmptyCategory categoryName={vm.categoryName} />
          ) : (
            <View className="px-4">
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
