// src/features/leaflets/screens/leaflets-content.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { LeafletCard } from "../components/leaflet-card";
import { LeafletViewer } from "../components/leaflet-viewer";
import { SearchInput } from "@/components/custom/search-input";
import { LeafletsFilter } from "../components/leaflets-filter";
import { CompanyTabs } from "../components/company-tabs";
import { ShoppingBag } from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { useQueryClient } from "@tanstack/react-query";

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
    <ScrollView
      className="flex-1 bg-background-100"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Cabeçalho */}
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold mb-2">Encartes e Ofertas</Text>
        <Text className="text-gray-600 text-center">
          Confira os melhores preços e promoções das lojas da sua região
        </Text>
      </View>

      {/* Input de Busca */}
      <SearchInput
        value={vm.searchTerm}
        onChangeText={vm.setSearchTerm}
        placeholder="Buscar encartes..."
        disabled={vm.isLoading}
      />

      {/* Filtros */}
      <LeafletsFilter
        companies={vm.companies}
        categories={vm.categories}
        selectedCompany={vm.selectedCompany}
        selectedCategory={vm.selectedCategory}
        onSelectCompany={vm.setSelectedCompany}
        onSelectCategory={vm.setSelectedCategory}
        isLoading={vm.isLoading}
        onClearFilters={vm.clearFilters}
      />

      {/* Tabs de Empresas */}
      <CompanyTabs
        companies={vm.companies}
        selectedCompany={vm.selectedCompany}
        onSelectCompany={vm.setSelectedCompany}
        isLoading={vm.isLoading}
      />

      {/* Lista de Encartes */}
      <View className="mt-4">
        {vm.isLoading ? (
          <View className="space-y-4">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </View>
        ) : vm.leaflets.length === 0 ? (
          <View className="items-center justify-center py-16">
            <ShoppingBag size={48} color="#9CA3AF" />
            <Text className="text-lg font-medium mt-4 mb-2">
              Nenhum encarte encontrado
            </Text>
            <Text className="text-gray-500 text-center max-w-xs">
              Não encontramos encartes ativos no momento.
              {vm.selectedCompany || vm.selectedCategory
                ? " Tente remover os filtros."
                : " Volte mais tarde."}
            </Text>
          </View>
        ) : (
          <View>
            {vm.leaflets.map((leaflet) => (
              <LeafletCard
                key={leaflet.id}
                leaflet={leaflet}
                onPress={() => handleOpenLeaflet(leaflet)}
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
  );
}
