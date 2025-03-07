// Path: src/features/delivery/screens/delivery-screen-content.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Truck, Filter, X } from "lucide-react-native";

import { Section } from "@/components/custom/section";
import { DeliveryGrid } from "../components/delivery-grid";
import { SubcategoryFilters } from "../components/subcategory-filters";
import { THEME_COLORS } from "@/src/styles/colors";
import { useDeliveryContext } from "../contexts/use-delivery-page-context";
import { CategoryFilterGrid } from "../components/category-filter-grid";
import { useDeliveryShowcases } from "../hooks/use-delivery-showcases";
import { DeliveryShowcaseCarousel } from "../components/delivery-showcase-carousel";
import { EnhancedDeliveryShowcaseSection } from "../components/enhanced-delivery-showcase-section";

export function DeliveryScreenContent() {
  // Estados locais
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Tente recuperar o contexto de forma segura
  let contextData;
  try {
    contextData = useDeliveryContext();
  } catch (error) {
    console.error("Error retrieving delivery context:", error);
    setHasError(true);
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao obter contexto"
    );

    // Renderize a UI de erro se não conseguir obter o contexto
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-lg font-semibold text-red-500 mb-2">
          Erro ao carregar a página
        </Text>
        <Text className="text-gray-600 mb-4 text-center">
          {errorMessage ||
            "Não foi possível carregar os dados. Tente novamente mais tarde."}
        </Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => setHasError(false)}
        >
          <Text className="text-white font-medium">Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Extrai dados do contexto com valores padrão seguros
  const {
    searchQuery = "",
    setSearchQuery = () => {},
    selectedSubcategories = [],
    setSelectedSubcategory = () => {},
    subcategories = [],
    filteredProfiles = [],
    isLoading = false,
    refetchProfiles = () => {},
  } = contextData || {};

  // Função para refresh pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchProfiles();
    } catch (error) {
      console.error("Error refreshing profiles:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Se ocorrer um erro posterior, exibe uma tela de erro
  if (hasError) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-lg font-semibold text-red-500 mb-2">
          Algo deu errado
        </Text>
        <Text className="text-gray-600 mb-4 text-center">
          {errorMessage || "Não foi possível carregar os estabelecimentos"}
        </Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => {
            setHasError(false);
            setErrorMessage("");
            onRefresh();
          }}
        >
          <Text className="text-white font-medium">Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const {
    showcases,
    isLoading: isLoadingShowcases,
    companiesWithShowcases,
  } = useDeliveryShowcases(filteredProfiles);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header e Banner */}
        <Section className="pt-6">
          <View className="mb-8">
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Truck
                  size={20}
                  color={THEME_COLORS.primary}
                  className="mr-2"
                />
                <Text className="text-lg font-semibold text-primary">
                  Delivery
                </Text>
              </View>

              <View className="flex-col gap-2">
                <Text className="text-3xl font-gothic text-secondary">
                  PEÇA SEM SAIR
                </Text>
                <Text className="text-3xl font-gothic text-primary">
                  DE CASA
                </Text>
              </View>

              <Text className="text-gray-600 mt-2">
                Encontre os melhores restaurantes e estabelecimentos com entrega
                na sua região
              </Text>
            </View>

            {/* Barra de pesquisa com botão de filtro */}
            <View className="flex-row items-center">
              <View className="relative flex-1">
                <Search
                  className="absolute left-3 top-3 z-10"
                  size={18}
                  color={THEME_COLORS.primary}
                />
                <TextInput
                  placeholder="Buscar restaurantes, comidas..."
                  value={searchQuery}
                  onChangeText={(text) => {
                    if (setSearchQuery) setSearchQuery(text);
                  }}
                  className="h-12 pl-10 pr-4 bg-white border border-gray-200 rounded-lg"
                />
              </View>

              <TouchableOpacity
                className="ml-2 w-12 h-12 bg-primary rounded-lg items-center justify-center"
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Section>

        {/* Filtros por categoria com grid similar ao commerce */}
        {subcategories && subcategories.length > 0 && (
          <Section className="mb-4 bg-white py-4 rounded-lg">
            {isLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color={THEME_COLORS.primary} />
              </View>
            ) : (
              <CategoryFilterGrid
                subcategories={subcategories}
                selectedSubcategories={selectedSubcategories}
                onSelectSubcategory={(slug) => {
                  if (setSelectedSubcategory) setSelectedSubcategory(slug);
                }}
                title="Categorias"
                description="Escolha uma categoria para filtrar"
              />
            )}

            {/* Indicador de filtros ativos */}
            {selectedSubcategories.length > 0 && (
              <View className="mx-4 mt-2 pt-4 border-t border-gray-100">
                <View className="flex-row flex-wrap items-center">
                  <Text className="text-sm text-gray-500 mr-2">
                    Filtros ativos:
                  </Text>

                  {selectedSubcategories.map((slug) => {
                    // Encontrar a subcategoria pelo slug
                    const category = subcategories.find(
                      (sub) => sub.slug === slug
                    );

                    return (
                      <TouchableOpacity
                        key={slug}
                        className="flex-row items-center bg-primary-100 rounded-full px-3 py-1 mr-2 mb-2"
                        onPress={() => setSelectedSubcategory(null)}
                      >
                        <Text className="text-xs text-primary-700 mr-1">
                          {category?.nome || slug}
                        </Text>
                        <X size={12} color={THEME_COLORS.primary} />
                      </TouchableOpacity>
                    );
                  })}

                  {selectedSubcategories.length > 0 && (
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                      onPress={() => setSelectedSubcategory(null)}
                    >
                      <Text className="text-xs text-gray-600">
                        Limpar filtros
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </Section>
        )}

        {/* Contador de resultados */}
        <Section className="mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 font-medium">
              {filteredProfiles.length}{" "}
              {filteredProfiles.length === 1
                ? "estabelecimento encontrado"
                : "estabelecimentos encontrados"}
            </Text>
          </View>
        </Section>

        {/* Seção de Vitrines Aprimorada */}
        {companiesWithShowcases && companiesWithShowcases.length > 0 && (
          <Section className="mt-8 pt-4 border-t border-gray-100">
            <EnhancedDeliveryShowcaseSection
              companiesWithShowcases={companiesWithShowcases}
              showcases={showcases}
              isLoading={isLoadingShowcases}
            />
          </Section>
        )}

        {/* Estado de carregamento */}
        {isLoading && !refreshing ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color={THEME_COLORS.primary} />
            <Text className="text-gray-500 mt-4">
              Carregando estabelecimentos...
            </Text>
          </View>
        ) : (
          // Grid de estabelecimentos agrupados por categoria
          <Section>
            <DeliveryGrid
              profiles={filteredProfiles}
              isLoading={isLoading}
              groupByCategory={selectedSubcategories.length === 0}
              subcategories={subcategories}
            />
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
