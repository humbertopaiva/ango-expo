// src/features/products/screens/products-content.tsx
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";

export function ProductsContent() {
  const vm = useProductsContext();

  // Funções para navegação direta em vez de usar modal
  const handleAddProduct = () => {
    router.push("/(app)/admin/products/new");
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/(app)/admin/products/${productId}`);
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

        {/* Add Button */}
        <View className="my-3">
          <Button onPress={handleAddProduct}>
            <Plus size={18} color="white" className="mr-2" />
            <ButtonText>Novo Produto</ButtonText>
          </Button>
        </View>

        {/* Products List */}
        <View className="flex-1">
          <ProductsList
            products={vm.products}
            isLoading={vm.isLoading}
            onEdit={(product) => handleEditProduct(product.id)}
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
