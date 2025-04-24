// Path: src/features/addons/screens/addons-content.tsx
import React from "react";
import { View, Text, SafeAreaView } from "react-native";

import { AddonsList } from "../components/addons-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { SectionCard } from "@/components/custom/section-card";
import { useAddonsContext } from "../contexts/use-addons-context";

export function AddonsContent() {
  const vm = useAddonsContext();

  // Navigation functions
  const handleAddAddonsList = () => {
    router.push("/admin/addons/new");
  };

  const handleEditAddonsList = (addonsList: any) => {
    router.push(`/admin/addons/${addonsList.id}`);
  };

  const handleViewAddonsList = (addonsList: any) => {
    router.push(`/admin/addons/view/${addonsList.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 px-4">
        <SectionCard title="Gerenciamento de Adicionais">
          <View className="py-2">
            <Text className="text-gray-700">
              Gerencie suas listas de produtos adicionais para categorias
            </Text>
          </View>
        </SectionCard>

        {/* Search */}
        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar listas de adicionais..."
          disabled={vm.isLoading}
        />

        {/* Addons List */}
        <View className="flex-1">
          <AddonsList
            addonsList={vm.filteredAddonsList}
            isLoading={vm.isLoading}
            onEdit={handleEditAddonsList}
            onDelete={(addonsList) => vm.confirmDeleteAddonsList(addonsList.id)}
            onView={handleViewAddonsList}
          />
        </View>

        {/* Primary Action Button */}
        <PrimaryActionButton
          onPress={handleAddAddonsList}
          label="Nova Lista de Adicionais"
          icon={<Plus size={20} color="white" />}
        />

        {/* Confirmation Dialog */}
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
