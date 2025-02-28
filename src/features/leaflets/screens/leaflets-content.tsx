// Path: src/features/leaflets/screens/leaflets-content.tsx
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus, FileText, AlertCircle } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { LeafletDetailsList } from "../components/leaflet-details-list";
import { SearchInput } from "@/components/custom/search-input";
import { LeafletDetailsModal } from "../components/leaflet-details-modal";
import { Alert } from "@/components/ui/alert";
import { SwipeTutorial } from "@/components/custom/swipe-tutorial";

export function LeafletsContent() {
  const vm = useLeafletsContext();

  const handleAddLeaflet = () => {
    // Verifica se atingiu o limite de encartes
    if (vm.leafletCount >= 5) {
      return; // Não permite a criação de mais encartes
    }
    router.push("/admin/leaflets/new");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 w-full container px-4 mx-auto">
        {/* Contador de limite e alerta */}
        <View className="mt-3">
          <Text className="text-sm text-primary-700 mb-2">
            {vm.leafletCount}/5 encartes criados
          </Text>

          {vm.leafletCount >= 5 && (
            <Alert className="mb-4 bg-amber-50 border border-amber-200">
              <AlertCircle size={16} color="#F59E0B" />
              <Text className="ml-2 text-amber-700">
                Você atingiu o limite máximo de 5 encartes. Para criar um novo
                encarte, exclua um dos existentes.
              </Text>
            </Alert>
          )}
        </View>

        {/* Barra de busca */}
        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar encartes..."
          disabled={vm.isLoading}
        />

        {/* Lista de encartes com swipe */}
        <View className="flex-1 mt-4 pb-20">
          <LeafletDetailsList
            leaflets={vm.leaflets}
            isLoading={vm.isLoading}
            onEdit={(leaflet) => router.push(`/admin/leaflets/${leaflet.id}`)}
            onDelete={(leaflet) => vm.handleDeleteLeaflet(leaflet)}
            onView={(leaflet) => vm.handleViewLeaflet(leaflet)}
          />
        </View>

        {/* Botão de ação primária */}
        <PrimaryActionButton
          onPress={handleAddLeaflet}
          label="Novo Encarte"
          icon={<Plus size={20} color="white" />}
          primaryColor={vm.leafletCount >= 5 ? "#9CA3AF" : "#F4511E"}
          secondaryColor={vm.leafletCount >= 5 ? "#6B7280" : "#6200EE"}
        />

        {/* Diálogo de confirmação de exclusão */}
        <ConfirmationDialog
          isOpen={vm.isDeleteModalVisible}
          onClose={() => vm.setIsDeleteModalVisible(false)}
          onConfirm={vm.handleConfirmDelete}
          title="Excluir Encarte"
          message={`Tem certeza que deseja excluir o encarte "${vm.selectedLeaflet?.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          variant="danger"
          isLoading={vm.isDeleting}
        />

        {/* Modal de visualização de detalhes */}
        <LeafletDetailsModal
          leaflet={vm.selectedLeaflet}
          isVisible={vm.isViewModalVisible}
          onClose={() => vm.setIsViewModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
