// Path: src/features/category-page/screens/category-page-content.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { useCategoryPageContext } from "../contexts/use-category-page-context";
import { SubcategoriesTabs } from "../components/subcategories-tabs";
import { CompanyList } from "../components/company-list";
import { Section } from "@/components/custom/section";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { ModalFilter } from "../components/modal-filter";

export function CategoryPageContent() {
  const vm = useCategoryPageContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleSelectSubcategory = (slug: string | null) => {
    vm.setSelectedSubcategory(slug);
  };

  // Filtragem de empresas baseada no termo de busca
  const filteredCompanies = vm.companies.filter((company) =>
    company.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Section>
          {/* Cabeçalho da categoria */}
          <VStack space="md" className="mb-6">
            <Text className="text-2xl font-semibold text-gray-800">
              {vm.categoryName || "Carregando..."}
            </Text>
            <Text className="text-gray-600">
              Encontre os melhores estabelecimentos de{" "}
              {vm.categoryName?.toLowerCase() || "sua categoria"} perto de você.
            </Text>
          </VStack>

          {/* Barra de pesquisa e filtros */}
          <HStack space="md" className="mb-6">
            <View className="flex-1 bg-gray-100 rounded-xl flex-row items-center px-3">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800"
                placeholder="Buscar estabelecimentos..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <Pressable
              onPress={() => setShowFilterModal(true)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.9 : 1,
                  backgroundColor: THEME_COLORS.primary,
                  borderRadius: 12,
                  padding: 12,
                },
              ]}
            >
              <SlidersHorizontal size={20} color="#FFFFFF" />
            </Pressable>
          </HStack>

          {/* Subcategorias */}
          <SubcategoriesTabs
            subcategories={vm.subcategories}
            selectedSubcategory={vm.selectedSubcategory}
            onSelectSubcategory={handleSelectSubcategory}
            isLoading={vm.isLoading}
          />

          {/* Lista de Empresas */}
          <View className="mt-6">
            <CompanyList
              companies={filteredCompanies}
              isLoading={vm.isLoading}
              searchTerm={searchTerm}
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
