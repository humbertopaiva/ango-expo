// Path: src/features/delivery/screens/delivery-screen-content.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Truck, Sparkles } from "lucide-react-native";

import { Section } from "@/components/custom/section";
import { THEME_COLORS } from "@/src/styles/colors";
import { useDeliveryContext } from "../contexts/use-delivery-page-context";
import { HStack, VStack } from "@gluestack-ui/themed";
import { PromotionalBanner } from "../../commerce/components/promotional-banner";
import { DeliveryCategoriesHorizontal } from "../components/delivery-categories-horizontal";
import { OpenNowCompanies } from "../components/open-now-companies";
import { DeliveryCard } from "../components/delivery-card";

export function DeliveryScreenContent() {
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Extrair dados do contexto
  const {
    searchQuery = "",
    selectedSubcategories = [],
    setSelectedSubcategory = () => {},
    subcategories = [],
    filteredProfiles = [],
    isLoading = false,
    refetchProfiles = () => {},
    isLoadingShowcases = false,
    getShowcaseItemsBySlug = () => [],
    openCompanies = [],
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
          <View className="px-2">
            <PromotionalBanner imageUrl="https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/admin-panel/banner-telas/delivery.jpg" />
          </View>

          {/* Título estilizado igual ao comércio local */}
          <VStack className="px-4 w-full gap-1 mb-4">
            <Text className="text-3xl font-gothic text-secondary-500">
              PEÇA SEM SAIR
            </Text>
            <Text className="text-3xl font-gothic text-primary-500">
              DE CASA
            </Text>
          </VStack>

          {/* Texto descritivo igual ao comércio local */}
          <Text className="text-gray-600 font-sans px-4  mb-6">
            Encontre os melhores restaurantes e estabelecimentos com entrega na
            sua região
          </Text>
        </Section>

        {/* Filtros por categoria com design horizontal */}
        {subcategories && subcategories.length > 0 && (
          <Section className="mb-2">
            <DeliveryCategoriesHorizontal
              subcategories={subcategories}
              selectedSubcategories={selectedSubcategories}
              onSelectSubcategory={setSelectedSubcategory}
              isLoading={isLoading}
            />
          </Section>
        )}

        {/* Seção "Abertos Agora" (só aparece se tiver empresas abertas) */}
        {openCompanies.length > 0 && (
          <Section className="mb-4" paddingX={0}>
            <OpenNowCompanies profiles={openCompanies} isLoading={isLoading} />
          </Section>
        )}

        <Text className="text-xl font-semibold text-primary-500 px-4 mb-4">
          Encontre na cidade
        </Text>

        {/* Contador de resultados */}
        <Section className="mb-4">
          <View className="flex-row justify-between items-center">
            {/* Badge para subcategorias selecionadas */}
            {selectedSubcategories.length > 0 && (
              <View className="flex-row items-center bg-primary-100 rounded-full px-3 py-1">
                <Text className="text-primary-600 font-medium text-sm">
                  {subcategories.find(
                    (s) => s.slug === selectedSubcategories[0]
                  )?.nome || selectedSubcategories[0]}
                </Text>
                <TouchableOpacity
                  className="ml-2"
                  onPress={() => setSelectedSubcategory(null)}
                >
                  <View className="h-5 w-5 rounded-full bg-primary-200 items-center justify-center">
                    <Text className="text-primary-600 text-xs font-bold">
                      ×
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Section>

        {/* Lista de empresas com vitrines integradas */}
        <Section className="bg-white" paddingX={0}>
          {isLoading && !refreshing ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color={THEME_COLORS.primary} />
              <Text className="text-gray-500 mt-4">
                Carregando estabelecimentos...
              </Text>
            </View>
          ) : filteredProfiles.length === 0 ? (
            <View className="py-16 px-4 items-center">
              <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-4">
                <Truck size={28} color={THEME_COLORS.primary} />
              </View>
              <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Nenhum estabelecimento encontrado
              </Text>
              <Text className="text-gray-500 text-center mb-8">
                {selectedSubcategories.length > 0
                  ? `Não encontramos estabelecimentos na categoria selecionada.`
                  : `Não encontramos estabelecimentos de delivery disponíveis.`}
              </Text>
              {selectedSubcategories.length > 0 && (
                <TouchableOpacity
                  className="bg-primary-50 px-6 py-3 rounded-full"
                  onPress={() => setSelectedSubcategory(null)}
                >
                  <Text className="text-primary-500 font-medium">
                    Limpar filtros
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="px-4 flex-row flex-wrap justify-between">
              {filteredProfiles.map((profile, index) => (
                <DeliveryCard
                  key={profile.id + index}
                  profile={profile}
                  showcaseItems={getShowcaseItemsBySlug(
                    profile.empresa?.slug || ""
                  )}
                  index={index}
                />
              ))}
            </View>
          )}
        </Section>

        {/* Seção Sparkles no final para reforçar o delivery */}
        <Section className="pb-16">
          <View className="items-center">
            <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
              <Sparkles size={16} color={THEME_COLORS.primary} />
              <Text className="text-sm font-medium text-primary-600">
                Delivery em toda a cidade
              </Text>
            </HStack>

            <Text className="text-gray-600 text-center">
              Trabalhamos com os melhores restaurantes e estabelecimentos para
              entregar qualidade até você
            </Text>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
