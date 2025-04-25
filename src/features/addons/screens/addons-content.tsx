// Path: src/features/addons/screens/-addons-content.tsx
import React, { useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAddonsContext } from "../contexts/use-addons-context";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus, RefreshCw, Layers } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { SectionCard } from "@/components/custom/section-card";
import { AddonCard } from "../components/addon-card";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { THEME_COLORS } from "@/src/styles/colors";

export function AddonsContent() {
  const vm = useAddonsContext();

  // Funções de navegação
  const handleAddAddonsList = () => {
    router.push("/admin/addons/new");
  };

  const handleEditAddonsList = (addonsList: any) => {
    router.push(`/admin/addons/${addonsList.id}`);
  };

  const handleViewAddonsList = (addonsList: any) => {
    router.push(`/admin/addons/view/${addonsList.id}`);
  };

  // Para atualizar a lista com pull-to-refresh
  const onRefresh = useCallback(() => {
    vm.refreshAddonsList();
  }, [vm]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader
        title="Listas de Adicionais"
        backTo="/admin/products"
        showBackButton={true}
      />

      <View className="flex-1 px-4">
        <SectionCard title="Gerenciamento de Adicionais">
          <View className="py-2">
            <Text className="text-gray-700">
              Gerencie suas listas de produtos adicionais para categorias
              específicas
            </Text>
          </View>
        </SectionCard>

        {/* Atualizar manualmente */}
        <View className="bg-blue-50 p-3 mt-2 mb-4 rounded-lg">
          <TouchableOpacity
            onPress={vm.refreshAddonsList}
            className="flex-row items-center justify-center"
            disabled={vm.isRefreshing}
          >
            <RefreshCw size={16} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-600 font-medium">
              {vm.isRefreshing ? "Atualizando..." : "Atualizar dados"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de pesquisa */}
        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar listas de adicionais..."
          disabled={vm.isLoading || vm.isRefreshing}
        />

        {/* Lista de adicionais */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={vm.isRefreshing}
              onRefresh={onRefresh}
              colors={[THEME_COLORS.primary]}
              tintColor={THEME_COLORS.primary}
            />
          }
        >
          {vm.isLoading ? (
            <View className="flex items-center justify-center py-8">
              <Layers size={40} color="#D1D5DB" className="mb-2" />
              <Text className="text-gray-500 text-center">
                Carregando listas de adicionais...
              </Text>
            </View>
          ) : vm.filteredAddonsList.length === 0 ? (
            <View className="flex items-center justify-center py-12 bg-white rounded-lg mt-4">
              <Layers size={48} color="#D1D5DB" className="mb-3" />
              <Text className="text-gray-700 text-lg font-medium">
                Nenhuma lista de adicionais encontrada
              </Text>
              <Text className="text-gray-500 text-center mt-1 px-8">
                Crie uma nova lista de adicionais para melhorar suas vendas com
                opções extras
              </Text>
            </View>
          ) : (
            vm.filteredAddonsList.map((addon) => (
              <AddonCard
                key={addon.id}
                addon={addon}
                onEdit={() => handleEditAddonsList(addon)}
                onDelete={() => vm.confirmDeleteAddonsList(addon.id)}
                onView={() => handleViewAddonsList(addon)}
              />
            ))
          )}
        </ScrollView>

        {/* Botão para adicionar */}
        <PrimaryActionButton
          onPress={handleAddAddonsList}
          label="Nova Lista de Adicionais"
          icon={<Plus size={20} color="white" />}
        />

        {/* Diálogo de confirmação para exclusão */}
        <ConfirmationDialog
          isOpen={vm.isDeleteDialogOpen}
          onClose={vm.cancelDeleteAddonsList}
          onConfirm={() =>
            vm.addonsToDelete && vm.handleDeleteAddonsList(vm.addonsToDelete)
          }
          title="Excluir Lista de Adicionais"
          message="Tem certeza que deseja excluir esta lista de adicionais? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          variant="danger"
          isLoading={vm.isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}
