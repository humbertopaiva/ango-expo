// src/features/categories/screens/categories-content.tsx

import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { useCategoriesContext } from "../contexts/use-categories-context";
import { CategoriesList } from "../components/categories-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { CategoryFormModal } from "../components/category-form-modal";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { router } from "expo-router";

export function CategoriesContent() {
  const vm = useCategoriesContext();

  const handleAddCategory = () => {
    router.push("/admin/categories/new");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1">
        {/* Conteúdo fixo superior */}
        <View className="px-4 pt-3 pb-2">
          {/* Search */}
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar categorias..."
            disabled={vm.isLoading}
          />
        </View>

        {/* Conteúdo rolável */}
        <ScrollView
          className="flex-1 px-4 flex-grow bg-background-100"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <CategoriesList
            categories={vm.categories}
            isLoading={vm.isLoading}
            onEdit={(category) => {
              vm.setSelectedCategory(category);
              vm.setIsFormVisible(true);
            }}
            onDelete={(category) => vm.confirmDeleteCategory(category.id)}
          />
        </ScrollView>

        {/* Category Form Modal */}
        <CategoryFormModal
          isOpen={vm.isFormVisible}
          onClose={() => vm.setIsFormVisible(false)}
          onSubmit={
            vm.selectedCategory
              ? (data) => vm.handleUpdateCategory(vm.selectedCategory!.id, data)
              : vm.handleCreateCategory
          }
          isLoading={vm.isCreating || vm.isUpdating}
          category={vm.selectedCategory}
        />

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
