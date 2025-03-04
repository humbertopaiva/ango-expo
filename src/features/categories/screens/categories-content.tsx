// Path: src/features/categories/screens/categories-content.tsx
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { useCategoriesContext } from "../contexts/use-categories-context";
import { CategoriesList } from "../components/categories-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { router } from "expo-router";

export function CategoriesContent() {
  const vm = useCategoriesContext();

  const handleAddCategory = () => {
    router.push("/admin/categories/new");
  };

  const handleEditCategory = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1">
        {/* Conteúdo fixo superior */}
        <View className="px-4 pt-3 bg-background-100">
          {/* Search */}
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar categorias..."
            disabled={vm.isLoading}
          />
        </View>

        {/* Lista de categorias */}
        <View className="flex-1 px-4 pt-2 pb-20 bg-background-100">
          <CategoriesList
            categories={vm.categories}
            isLoading={vm.isLoading}
            onEdit={(category) => handleEditCategory(category.id)}
            onDelete={(category) => vm.confirmDeleteCategory(category.id)}
          />
        </View>

        {/* Primary Action Button */}
        <PrimaryActionButton
          onPress={handleAddCategory}
          label="Nova Categoria"
          icon={<Plus size={20} color="white" />}
        />

        {/* Confirmation Dialog */}
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
