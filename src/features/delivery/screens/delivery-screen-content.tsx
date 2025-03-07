// Path: src/features/delivery/screens/delivery-screen-content.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Truck, ArrowRight } from "lucide-react-native";

import { Section } from "@/components/custom/section";
import { DeliveryCard } from "../components/delivery-card";
import { CategoryFilterGrid } from "@/components/custom/category-filter-grid";
import { THEME_COLORS } from "@/src/styles/colors";
import { useDeliveryContext } from "../contexts/use-delivery-page-context";
import { SafeMap } from "@/components/common/safe-map";

export function DeliveryScreenContent() {
  // Estado para controle de erros
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Use try-catch apenas para recuperar o contexto e dados iniciais
  let contextData;
  try {
    contextData = useDeliveryContext();

    // Log para debug
    console.log("Context data retrieved successfully:", !!contextData);
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

  // Se chegamos aqui, temos os dados do contexto
  const {
    searchQuery = "",
    setSearchQuery = () => {},
    selectedSubcategories = [],
    setSelectedSubcategory = () => {},
    subcategories = [],
    filteredProfiles = [],
    isLoading = false,
  } = contextData || {};

  // Registre os valores para depuração
  useEffect(() => {
    console.log("DeliveryScreenContent mounted");
    console.log("subcategories:", subcategories);
    console.log("filteredProfiles:", filteredProfiles);

    // Limpe quando o componente for desmontado
    return () => {
      console.log("DeliveryScreenContent unmounted");
    };
  }, [subcategories, filteredProfiles]);

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
          }}
        >
          <Text className="text-white font-medium">Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Renderiza o conteúdo principal
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
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

            {/* Barra de pesquisa */}
            <View className="relative">
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
          </View>
        </Section>

        {/* Filtros por categoria - Renderização condicional segura */}
        {subcategories && subcategories.length > 0 && (
          <View className="mb-6">
            {isLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color={THEME_COLORS.primary} />
              </View>
            ) : (
              <CategoryFilterGrid
                title="Tipos de Estabelecimento"
                description="Escolha uma categoria para filtrar os estabelecimentos"
                categories={subcategories}
                selectedItem={
                  selectedSubcategories && selectedSubcategories.length === 1
                    ? selectedSubcategories[0]
                    : null
                }
                onSelect={(slug) => {
                  if (setSelectedSubcategory) setSelectedSubcategory(slug);
                }}
              />
            )}
          </View>
        )}

        {/* Lista de estabelecimentos - Renderização condicional segura */}
        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SafeMap
            data={filteredProfiles}
            renderItem={(profile) => (
              <DeliveryCard key={profile.id} profile={profile} />
            )}
            fallback={<Text>Nenhum estabelecimento disponível.</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
