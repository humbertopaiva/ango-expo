// src/features/products/screens/products-content.tsx
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { useCategories } from "../../categories/hooks/use-categories";
import { CategoryFilter } from "../components/category-filter";

export function ProductsContent() {
  const vm = useProductsContext();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  // Funções para navegação direta em vez de usar modal
  const handleAddProduct = () => {
    router.push("/admin/products/new");
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

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

        {/* Filtro de Categorias */}
        {!isCategoriesLoading && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={vm.selectedCategoryId}
            onSelectCategory={vm.setSelectedCategory}
          />
        )}

        {/* Products List */}
        <View className="flex-1 pb-20">
          <ProductsList
            products={vm.products}
            isLoading={vm.isLoading}
            onEdit={(product) => handleEditProduct(product.id)}
            onDelete={(product) => vm.confirmDeleteProduct(product.id)}
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
