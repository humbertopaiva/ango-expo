// Path: src/features/addons/screens/addons-content.tsx

import React, { useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useAddonsContext } from "../contexts/use-addons-context";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus, RefreshCw, Layers } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { THEME_COLORS } from "@/src/styles/colors";
import { AddonCard } from "../components/addon-card";

export function AddonsContent() {
  const vm = useAddonsContext();

  const handleAddAddonsList = () => {
    router.push("/admin/addons/new");
  };

  const handleEditAddonsList = (addonsList: any) => {
    router.push(`/admin/addons/${addonsList.id}`);
  };

  const handleViewAddonsList = (addonsList: any) => {
    router.push(`/admin/addons/view/${addonsList.id}`);
  };

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

      <View className="px-4 py-2">
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <View className="flex-row items-center border-b border-gray-100 pb-3 mb-3">
            <Layers size={20} color={THEME_COLORS.primary} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Gerenciamento de Adicionais
            </Text>
          </View>
          <Text className="text-gray-600">
            Gerencie suas listas de produtos adicionais para categorias
            específicas
          </Text>
        </View>

        <View className="flex-row mb-4 bg-blue-50 p-2.5 rounded-lg">
          <TouchableOpacity
            onPress={vm.refreshAddonsList}
            className="flex-row items-center justify-center flex-1"
            disabled={vm.isRefreshing}
          >
            <RefreshCw size={16} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-600 font-medium">
              {vm.isRefreshing ? "Atualizando..." : "Atualizar dados"}
            </Text>
          </TouchableOpacity>
        </View>

        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar listas de adicionais..."
          disabled={vm.isLoading || vm.isRefreshing}
        />

        {vm.isLoading ? (
          <View className="flex items-center justify-center py-16 bg-white rounded-xl">
            <Layers size={40} color="#D1D5DB" className="mb-2" />
            <Text className="text-gray-500 text-center">
              Carregando listas de adicionais...
            </Text>
          </View>
        ) : vm.filteredAddonsList.length === 0 ? (
          <View className="flex items-center justify-center py-16 bg-white rounded-xl">
            <Layers size={48} color="#D1D5DB" className="mb-3" />
            <Text className="text-gray-700 text-lg font-medium">
              Nenhuma lista de adicionais encontrada
            </Text>
            <Text className="text-gray-500 text-center mt-1 px-8 mb-6">
              Crie uma nova lista de adicionais para melhorar suas vendas com
              opções extras
            </Text>
            <TouchableOpacity
              onPress={handleAddAddonsList}
              className="bg-primary-500 px-6 py-3 rounded-lg flex-row items-center"
            >
              <Plus size={18} color="white" className="mr-2" />
              <Text className="text-white font-medium">Nova Lista</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={vm.filteredAddonsList}
            renderItem={({ item }) => (
              <AddonCard
                addon={item}
                onEdit={() => handleEditAddonsList(item)}
                onDelete={() => vm.confirmDeleteAddonsList(item.id)}
                onView={() => handleViewAddonsList(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={vm.isRefreshing}
                onRefresh={onRefresh}
                colors={[THEME_COLORS.primary]}
                tintColor={THEME_COLORS.primary}
              />
            }
          />
        )}
      </View>

      {vm.filteredAddonsList.length > 0 && (
        <PrimaryActionButton
          onPress={handleAddAddonsList}
          label="Nova Lista"
          icon={<Plus size={20} color="white" />}
        />
      )}

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
    </SafeAreaView>
  );
}
