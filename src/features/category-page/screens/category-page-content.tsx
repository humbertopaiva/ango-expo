// Path: src/features/category-page/screens/category-page-content.tsx
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useCategoryPageContext } from "../contexts/use-category-page-context";
import { SubcategoriesTabs } from "../components/subcategories-tabs";
import { CompanyList } from "../components/company-list";
import { Section } from "@/components/custom/section";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalFilter } from "../components/modal-filter";
import { EmptyCategory } from "../components/empty-category";
import { Box } from "@/components/ui/box";
import { CategoryHeader } from "../components/category-header";
import { useCategoryDetails } from "../hooks/use-category-details";
import { useLocalSearchParams } from "expo-router";
import { ActiveFilters } from "../components/active-filters";

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

  // Nome da subcategoria selecionada (para mostrar no filtro ativo)
  const selectedSubcategoryName = vm.selectedSubcategory
    ? vm.subcategories.find((sub) => sub.slug === vm.selectedSubcategory)
        ?.nome || null
    : null;

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

          {/* Exibição dos filtros ativos */}
          <ActiveFilters
            selectedSubcategory={vm.selectedSubcategory}
            subcategoryName={selectedSubcategoryName}
            onClearFilter={() => handleSelectSubcategory(null)}
          />

          {filteredCompanies.length === 0 && !vm.isLoading ? (
            <EmptyCategory
              categoryName={vm.categoryName}
              subcategoryName={selectedSubcategoryName || undefined}
            />
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
