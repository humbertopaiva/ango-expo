// Path: src/features/leaflets-page/screens/leaflets-content.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { LeafletViewer } from "../components/leaflet-viewer";
import { SearchInput } from "@/components/custom/search-input";
import { ShoppingBag, FileText, Sparkles } from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryFilterChips } from "../components/category-filter-chips";
import { CategoryLeafletsSection } from "../components/category-leaflets-section";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export function LeafletsContent() {
  const vm = useLeafletsContext();
  const queryClient = useQueryClient();
  const [selectedLeaflet, setSelectedLeaflet] = useState<Leaflet | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleOpenLeaflet = (leaflet: Leaflet) => {
    setSelectedLeaflet(leaflet);
    setViewerVisible(true);
  };

  const handleCloseViewer = () => {
    setViewerVisible(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["leaflets"] });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View className="items-center mb-6 pt-6 px-4">
          <HStack className="bg-secondary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
            <Sparkles size={18} color={THEME_COLORS.secondary} />
            <Text className="text-sm font-medium text-secondary-600">
              Promoções e Ofertas
            </Text>
          </HStack>

          <VStack alignItems="center" space="xs">
            <Text className="text-3xl font-gothic text-secondary-600 text-center mb-1">
              ENCARTES PROMOCIONAIS
            </Text>
            <Text className="text-gray-600 text-center font-sans">
              Confira os melhores preços e ofertas das lojas da sua região
            </Text>
          </VStack>
        </View>

        {/* Barra de busca */}
        <View className="px-4 mb-6">
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar encartes..."
            disabled={vm.isLoading}
          />
        </View>

        {/* Filtros de Categorias */}
        <CategoryFilterChips
          categories={vm.categories}
          activeCategories={vm.activeCategories}
          toggleCategory={vm.toggleCategoryFilter}
          selectAll={vm.selectAllCategories}
          allCategoriesSelected={vm.allCategoriesSelected}
          isLoading={vm.isLoading}
        />

        {/* Conteúdo principal: encartes por categoria */}
        <View className="mt-6">
          {vm.isLoading ? (
            <View className="space-y-8 px-4">
              {[1, 2].map((i) => (
                <View key={i} className="space-y-4">
                  <View className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
                  <View className="flex-row space-x-4">
                    <View className="h-48 w-40 bg-gray-200 rounded-lg animate-pulse" />
                    <View className="h-48 w-40 bg-gray-200 rounded-lg animate-pulse" />
                  </View>
                </View>
              ))}
            </View>
          ) : vm.categorizedLeaflets.length === 0 ? (
            <View className="items-center justify-center py-16">
              <ShoppingBag size={48} color="#9CA3AF" />
              <Text className="text-lg font-medium mt-4 mb-2">
                Nenhum encarte encontrado
              </Text>
              <Text className="text-gray-500 text-center max-w-xs">
                Não encontramos encartes ativos com os filtros selecionados.
                Tente remover os filtros ou tente novamente mais tarde.
              </Text>
            </View>
          ) : (
            <View>
              {vm.categorizedLeaflets.map((category) => (
                <CategoryLeafletsSection
                  key={category.id}
                  categoryName={category.name}
                  categorySlug={category.slug}
                  leaflets={category.leaflets}
                  onLeafletPress={handleOpenLeaflet}
                />
              ))}
            </View>
          )}
        </View>

        {/* Viewer de Encartes */}
        {selectedLeaflet && (
          <LeafletViewer
            leaflet={selectedLeaflet}
            visible={viewerVisible}
            onClose={handleCloseViewer}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
