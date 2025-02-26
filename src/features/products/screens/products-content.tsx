// src/features/products/screens/products-content.tsx
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { router } from "expo-router";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";

export function ProductsContent() {
  const vm = useProductsContext();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 w-full container px-4 mx-auto">
        {/* Search */}
        <View className="mt-3">
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar produtos..."
            disabled={vm.isLoading}
          />
        </View>

        {/* Products List */}
        <View className="flex-1">
          <ProductsList
            products={vm.products}
            isLoading={vm.isLoading}
            onEdit={(product) => {
              router.push(`/(app)/admin/products/${product.id}` as any);
            }}
            onDelete={(product) => vm.confirmDeleteProduct(product.id)}
          />
        </View>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={vm.isDeleteDialogOpen}
          onClose={vm.cancelDeleteProduct}
          onConfirm={() =>
            vm.productToDelete && vm.handleDeleteProduct(vm.productToDelete)
          }
          title="Excluir Produto"
          message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          variant="danger"
          isLoading={vm.isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}
