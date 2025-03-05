// Path: src/features/category-page/screens/category-page-content.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useCategoryPageContext } from "../contexts/use-category-page-context";
import { SubcategoriesTabs } from "../components/subcategories-tabs";
import { CategoryCompaniesGrid } from "../components/category-companies-grid";
import { ShowcaseProducts } from "@/src/features/commerce/components/showcase-products";
import { Section } from "@/components/custom/section";
import _ from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

export function CategoryPageContent() {
  const vm = useCategoryPageContext();

  // Agrupa produtos por empresa
  const groupedProducts = _.groupBy(vm.showcaseProducts, (product) =>
    typeof product.empresa === "string"
      ? product.empresa
      : (product.empresa as any)?.slug
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Section>
          {/* Subcategorias */}
          <SubcategoriesTabs
            subcategories={vm.subcategories}
            selectedSubcategory={vm.selectedSubcategory}
            onSelectSubcategory={vm.setSelectedSubcategory}
            isLoading={vm.isLoading}
          />

          <View className="space-y-8 mt-6">
            {/* Grid de Empresas */}
            <View>
              <Text className="text-xl font-semibold mb-4">Empresas</Text>
              <CategoryCompaniesGrid
                companies={vm.companies}
                isLoading={vm.isLoading}
              />
            </View>

            {/* Produtos em Destaque */}
            <View className="space-y-6 mt-8">
              <Text className="text-xl font-semibold">
                Produtos em Destaque
              </Text>
              {vm.companies.map((company) => (
                <ShowcaseProducts
                  key={company.id}
                  products={groupedProducts[company.slug] || []}
                  isLoading={vm.isLoading}
                  companyName={company.nome}
                />
              ))}
            </View>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
