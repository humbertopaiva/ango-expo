// Path: src/features/products/screens/products-list-screen.tsx
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { CategoryFilter } from "../components/category-filter";
import { SwipeTutorial } from "@/components/custom/swipe-tutorial";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { useCategories } from "../../categories/hooks/use-categories";

export function ProductsListScreen() {
  const vm = useProductsContext();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [showSwipeTutorial, setShowSwipeTutorial] = useState(false);

  // Verificar se é a primeira vez que o usuário abre a tela
  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasVisitedBefore = await AsyncStorage.getItem(
          "products_swipe_tutorial_shown"
        );
        if (!hasVisitedBefore) {
          setShowSwipeTutorial(true);
          await AsyncStorage.setItem("products_swipe_tutorial_shown", "true");
        }
      } catch (error) {
        console.error("Erro ao verificar primeira visita:", error);
      }
    };

    checkFirstVisit();
  }, []);

  // Funções para navegação
  const handleAddProduct = () => {
    router.push("/admin/products/new");
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <AdminScreenHeader
        title="Produtos Cadastrados"
        backTo="/admin/products"
      />

      <View className="flex-1 px-4">
        {/* Tutorial de swipe (exibido apenas na primeira vez) */}
        {showSwipeTutorial && (
          <SwipeTutorial
            show={showSwipeTutorial}
            onDismiss={() => setShowSwipeTutorial(false)}
          />
        )}

        {/* Filtro de Categorias */}
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

        {/* Products List */}
        <View className="flex-1 pb-20">
          <ProductsList
            products={vm.filteredProducts}
            isLoading={vm.isLoading}
            onEdit={(product) => handleEditProduct(product.id)}
            onDelete={(product) => vm.confirmDeleteProduct(product.id)}
            onView={(product) =>
              router.push(`/admin/products/view/${product.id}`)
            }
            onAddVariation={(product) =>
              router.push(`/admin/products/${product.id}/add-variation`)
            }
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
