// Path: src/features/categories/screens/categories-content.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { useCategoriesContext } from "../contexts/use-categories-context";
import { CategoriesList } from "../components/categories-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { CategoryFormModal } from "../components/category-form-modal";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { router } from "expo-router";
import { CategoryFormData } from "../schemas/category.schema";

export function CategoriesContent() {
  const vm = useCategoriesContext();
  const [showNewButton, setShowNewButton] = useState(true);

  // Função para abrir o modal de criação
  const handleAddCategory = () => {
    vm.setSelectedCategory(null);
    vm.setIsFormVisible(true);
    setShowNewButton(false);
  };

  // Função para lidar com o fechamento do modal
  const handleCloseModal = () => {
    vm.setIsFormVisible(false);
    vm.setSelectedCategory(null);
    setShowNewButton(true);
  };

  // Função para lidar com envio do formulário no modal
  const handleFormSubmit = async (data: CategoryFormData) => {
    let success = false;

    if (vm.selectedCategory) {
      // Edição
      success = await vm.handleUpdateCategory(vm.selectedCategory.id, data);
    } else {
      // Criação
      success = await vm.handleCreateCategory(data);
    }

    if (success) {
      handleCloseModal();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1">
        <View className="px-4 pt-3 bg-background-100">
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar categorias..."
            disabled={vm.isLoading}
          />
        </View>

        <View className="flex-1 px-4 pt-2 pb-20 bg-background-100">
          <CategoriesList
            categories={vm.categories}
            isLoading={vm.isLoading}
            onEdit={(category) => {
              vm.setSelectedCategory(category);
              vm.setIsFormVisible(true);
              setShowNewButton(false);
            }}
            onDelete={(category) => vm.confirmDeleteCategory(category.id)}
          />
        </View>

        <CategoryFormModal
          isOpen={vm.isFormVisible}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          isLoading={vm.isCreating || vm.isUpdating}
          category={vm.selectedCategory}
        />

        {showNewButton && (
          <PrimaryActionButton
            onPress={handleAddCategory}
            label="Nova Categoria"
            icon={<Plus size={20} color="white" />}
          />
        )}

        <ConfirmationDialog
          isOpen={vm.isDeleteDialogOpen}
          onClose={vm.cancelDeleteCategory}
          onConfirm={() =>
            vm.categoryToDelete && vm.handleDeleteCategory(vm.categoryToDelete)
          }
          title="Excluir Categoria"
          message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          variant="danger"
          isLoading={vm.isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}
