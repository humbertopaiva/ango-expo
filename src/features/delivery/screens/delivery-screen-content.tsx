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

export function DeliveryScreenContent() {
  // Estado para controle de erros
  const [hasError, setHasError] = useState(false);

  try {
    const {
      searchQuery,
      setSearchQuery,
      selectedSubcategories,
      toggleSubcategory,
      setSelectedSubcategory,
      subcategories = [], // Forneça um valor padrão
      filteredProfiles = [], // Forneça um valor padrão
      isLoading,
    } = useDeliveryContext();

    // Registre os valores para depuração
    useEffect(() => {
      console.log("DeliveryScreenContent mounted");
      console.log("subcategories:", subcategories);
      console.log("filteredProfiles:", filteredProfiles);

      // Limpe quando o componente for desmontado
      return () => {
        console.log("DeliveryScreenContent unmounted");
      };
    }, []);

    // Se ocorrer um erro, exibe uma tela de erro
    if (hasError) {
      return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">
          <Text className="text-lg font-semibold text-red-500 mb-2">
            Algo deu errado
          </Text>
          <Text className="text-gray-600 mb-4">
            Não foi possível carregar os estabelecimentos
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
                  Encontre os melhores restaurantes e estabelecimentos com
                  entrega na sua região
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
                  onChangeText={setSearchQuery}
                  className="h-12 pl-10 pr-4 bg-white border border-gray-200 rounded-lg"
                />
              </View>
            </View>
          </Section>

          {/* Filtros por categoria */}
          <View className="mb-6">
            {isLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color={THEME_COLORS.primary} />
              </View>
            ) : subcategories && subcategories.length > 0 ? (
              <CategoryFilterGrid
                title="Tipos de Estabelecimento"
                description="Escolha uma categoria para filtrar os estabelecimentos"
                categories={subcategories}
                selectedItem={
                  selectedSubcategories?.length === 1
                    ? selectedSubcategories[0]
                    : null
                }
                onSelect={setSelectedSubcategory}
              />
            ) : null}
          </View>

          {/* Lista de estabelecimentos */}
          <Section className="mt-2">
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold">
                  {filteredProfiles && filteredProfiles.length > 0
                    ? `Estabelecimentos (${filteredProfiles.length})`
                    : "Estabelecimentos"}
                </Text>

                {selectedSubcategories && selectedSubcategories.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSelectedSubcategory(null)}
                    className="flex-row items-center"
                  >
                    <Text className="text-primary mr-1">Limpar filtros</Text>
                    <ArrowRight size={16} color={THEME_COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>

              {isLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator
                    size="large"
                    color={THEME_COLORS.primary}
                  />
                </View>
              ) : filteredProfiles && filteredProfiles.length > 0 ? (
                <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((profile: any) => (
                    <DeliveryCard key={profile.id} profile={profile} />
                  ))}
                </View>
              ) : (
                <View className="bg-gray-50 rounded-lg p-8 items-center justify-center">
                  <Truck size={48} color="#d1d5db" />
                  <Text className="text-lg font-medium text-gray-700 mt-4 mb-1">
                    Nenhum estabelecimento encontrado
                  </Text>
                  <Text className="text-gray-500 text-center">
                    Tente ajustar seus filtros ou pesquise por outro termo
                  </Text>
                  {searchQuery ||
                  (selectedSubcategories &&
                    selectedSubcategories.length > 0) ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchQuery("");
                        setSelectedSubcategory(null);
                      }}
                      className="mt-4 bg-primary px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-medium">
                        Limpar filtros
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>
          </Section>

          {/* Informações adicionais para promoções ou destaques */}
          <Section className="mt-4 mb-8 bg-secondary-50 py-8 rounded-xl">
            <View className="items-center">
              <Truck
                size={40}
                color={THEME_COLORS.secondary}
                className="mb-4"
              />
              <Text className="text-2xl font-semibold text-secondary mb-2 text-center">
                Delivery rápido e prático
              </Text>
              <Text className="text-gray-600 text-center mb-6 max-w-md">
                Peça pelo aplicativo e receba em casa. Diversos estabelecimentos
                parceiros para você escolher.
              </Text>

              <View className="grid grid-cols-2 gap-4 mt-2">
                <View className="bg-white p-4 rounded-lg shadow-sm items-center">
                  <Text className="text-lg font-semibold text-primary mb-1">
                    +50
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">
                    Restaurantes disponíveis
                  </Text>
                </View>

                <View className="bg-white p-4 rounded-lg shadow-sm items-center">
                  <Text className="text-lg font-semibold text-primary mb-1">
                    30 min
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">
                    Tempo médio de entrega
                  </Text>
                </View>
              </View>
            </View>
          </Section>
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error("Error in DeliveryScreenContent:", error);
    // Se ocorrer um erro, atualize o estado
    setHasError(true);
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-lg font-semibold text-red-500 mb-2">
          Algo deu errado
        </Text>
        <Text className="text-gray-600 mb-4">
          Não foi possível carregar os estabelecimentos
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
}
