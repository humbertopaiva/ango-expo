// Path: src/features/products/screens/products-content.tsx
import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { useCategories } from "../../categories/hooks/use-categories";
import { CategoryFilter } from "../components/category-filter";
import { SectionCard } from "@/components/custom/section-card";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";

export function ProductsContent() {
  const vm = useProductsContext();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { hasVariation } = useProducts();

  // Navigation functions
  const handleAddProduct = () => {
    router.push("/admin/products/new");
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleViewProduct = (product: Product) => {
    router.push(`/admin/products/view/${product.id}`);
  };

  const handleAddVariation = (product: Product) => {
    if (!hasVariation(product)) return;
    router.push(`/admin/products/${product.id}/add-variation`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 px-4">
        <SectionCard title="Gerenciamento de Produtos">
          <View className="py-2">
            <Text className="text-gray-700">
              Gerencie seus produtos e suas variações (tamanhos, cores, etc.)
            </Text>
          </View>
        </SectionCard>

        {/* Category Filter */}
        {!isCategoriesLoading && categories.length > 0 && (
          <CategoryFilter
            categories={categories.map((c) => ({
              id: Number(c.id),
              nome: c.nome,
              imagem: c.imagem || "",
            }))}
            selectedCategoryId={vm.selectedCategoryId}
            onSelectCategory={vm.setSelectedCategory}
          />
        )}

        {/* Search */}
        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar produtos..."
          disabled={vm.isLoading}
        />

        {/* Products List - with proper scrolling */}
        <View className="flex-1">
          <ProductsList
            products={vm.filteredProducts}
            isLoading={vm.isLoading}
            onEdit={handleEditProduct}
            onDelete={(product) => vm.confirmDeleteProduct(product.id)}
            onView={handleViewProduct}
            onAddVariation={handleAddVariation}
          />
        </View>

        {/* Primary Action Button */}
        <PrimaryActionButton
          onPress={handleAddProduct}
          label="Novo Produto"
          icon={<Plus size={20} color="white" />}
        />

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
