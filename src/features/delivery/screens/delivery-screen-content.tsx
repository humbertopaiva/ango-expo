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
import { Search, Truck, Filter, X, Sparkles } from "lucide-react-native";

import { Section } from "@/components/custom/section";
import { DeliveryGrid } from "../components/delivery-grid";
import { SubcategoryFilters } from "../components/subcategory-filters";
import { THEME_COLORS } from "@/src/styles/colors";
import { useDeliveryContext } from "../contexts/use-delivery-page-context";
import { CategoryFilterGrid } from "../components/category-filter-grid";
import { useDeliveryShowcases } from "../hooks/use-delivery-showcases";
import { DeliveryShowcaseCarousel } from "../components/delivery-showcase-carousel";
import { EnhancedDeliveryShowcaseSection } from "../components/enhanced-delivery-showcase-section";
import { SimpleTabs, TabItem } from "@/components/custom/simple-tabs";
import { HStack, VStack } from "@gluestack-ui/themed";
import { PromotionalBanner } from "../../commerce/components/promotional-banner";

// Define the tab keys for easier reference
const TABS = {
  FEATURED: "featured",
  COMPANIES: "companies",
};

export function DeliveryScreenContent() {
  // Estados locais
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.FEATURED);

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

  // Configuração das tabs
  const tabs: TabItem[] = [
    { key: TABS.FEATURED, title: "Destaques" },
    {
      key: TABS.COMPANIES,
      title: "Empresas",
      badge: filteredProfiles.length,
    },
  ];

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
        <Section className="pt-4">
          <View className="">
            <PromotionalBanner />
            {/* Badge estilizada igual ao comércio local */}
            <HStack className="items-center justify-center mb-4">
              <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2">
                <Truck size={18} color={THEME_COLORS.primary} />
                <Text className="text-sm font-medium text-primary-600">
                  Delivery
                </Text>
              </HStack>
            </HStack>

            {/* Título estilizado igual ao comércio local */}
            <VStack className="items-center justify-center w-full gap-1 mb-4">
              <Text className="text-3xl font-gothic text-secondary-500">
                PEÇA SEM SAIR
              </Text>
              <Text className="text-3xl font-gothic text-primary-500">
                DE CASA
              </Text>
            </VStack>

            {/* Texto descritivo igual ao comércio local */}
            <Text className="text-gray-600 font-sans text-center mb-6">
              Encontre os melhores restaurantes e estabelecimentos com entrega
              na sua região
            </Text>
          </View>
        </Section>

        {/* Filtros por categoria com grid moderna */}
        {subcategories && subcategories.length > 0 && (
          <Section className="mb-6">
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
              />
            )}

            {/* Indicador de filtros ativos - mantenha este se necessário */}
            {selectedSubcategories.length > 0 && (
              <View className="mx-4 pt-2 border-t border-gray-100">
                <View className="flex-row flex-wrap items-center">
                  <Text className="text-md text-gray-500 mr-2">
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
                        <Text className="text-md text-primary-500 mr-1">
                          {category?.nome || slug}
                        </Text>
                        <X size={12} color={THEME_COLORS.primary} />
                      </TouchableOpacity>
                    );
                  })}

                  {/* <TouchableOpacity
                    className="flex-row items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2"
                    onPress={() => setSelectedSubcategory(null)}
                  >
                    <Text className="text-md text-gray-600">
                      Limpar filtros
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            )}
          </Section>
        )}

        {/* Contador de resultados */}
        <Section className="mb-4">
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 font-medium">
              {filteredProfiles.length}{" "}
              {filteredProfiles.length === 1
                ? "estabelecimento encontrado"
                : "estabelecimentos encontrados"}
            </Text>
          </View>
        </Section>

        {/* Tabs de navegação */}
        <Section className="px-2 bg-white">
          <SimpleTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Section>

        {/* Exibe o conteúdo com base na aba ativa */}
        {activeTab === TABS.FEATURED ? (
          /* Tab de Destaques */
          <>
            {/* Seção de Vitrines Aprimorada */}
            {companiesWithShowcases && companiesWithShowcases.length > 0 ? (
              <Section className="pt-4 border-t border-gray-100 bg-white">
                <EnhancedDeliveryShowcaseSection
                  companiesWithShowcases={companiesWithShowcases}
                  showcases={showcases}
                  isLoading={isLoadingShowcases}
                />
              </Section>
            ) : (
              <Section className="mt-8 items-center py-16">
                {isLoadingShowcases ? (
                  <ActivityIndicator
                    size="large"
                    color={THEME_COLORS.primary}
                  />
                ) : (
                  <View className="items-center">
                    <Text className="text-xl font-semibold text-gray-800 mb-2">
                      Sem destaques
                    </Text>
                    <Text className="text-gray-500 text-center">
                      Não há produtos em destaque no momento.
                    </Text>
                    <TouchableOpacity
                      className="mt-6 bg-primary-50 px-6 py-3 rounded-full"
                      onPress={() => setActiveTab(TABS.COMPANIES)}
                    >
                      <Text className="text-primary-500 font-medium">
                        Ver empresas
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Section>
            )}
          </>
        ) : (
          /* Tab de Empresas */
          <Section className="bg-white">
            {isLoading && !refreshing ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="large" color={THEME_COLORS.primary} />
                <Text className="text-gray-500 mt-4">
                  Carregando estabelecimentos...
                </Text>
              </View>
            ) : (
              // Grid de estabelecimentos agrupados por categoria
              <DeliveryGrid
                profiles={filteredProfiles}
                isLoading={isLoading}
                groupByCategory={selectedSubcategories.length === 0}
                subcategories={subcategories}
              />
            )}
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
