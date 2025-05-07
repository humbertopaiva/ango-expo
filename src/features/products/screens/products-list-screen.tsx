// Path: src/features/products/screens/products-list-screen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import {
  Plus,
  Filter,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { CategoryFilter } from "../components/category-filter";
import { SwipeTutorial } from "@/components/custom/swipe-tutorial";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { useCategories } from "../../categories/hooks/use-categories";
import { THEME_COLORS } from "@/src/styles/colors";
import { Product } from "../models/product";

export function ProductsListScreen() {
  const vm = useProductsContext();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [showSwipeTutorial, setShowSwipeTutorial] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a manual refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Functions for navigation
  const handleAddProduct = () => {
    router.push("/admin/products/new");
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Tutorial de swipe (exibido apenas na primeira vez) */}
      {showSwipeTutorial && (
        <SwipeTutorial
          show={showSwipeTutorial}
          onDismiss={() => setShowSwipeTutorial(false)}
        />
      )}

      {/* Top Action Bar */}
      <View className="bg-white px-4 py-3 flex-row justify-between items-center border-b border-gray-100">
        <Text className="text-gray-700">
          {vm.filteredProducts.length} produto
          {vm.filteredProducts.length !== 1 ? "s" : ""}
        </Text>

        <View className="flex-row">
          <TouchableOpacity
            className="p-2 mr-2 bg-gray-100 rounded-full"
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 bg-gray-100 rounded-full"
            onPress={onRefresh}
          >
            <RefreshCw size={18} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View className="px-4 pt-4 pb-2">
        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar produtos..."
          disabled={vm.isLoading}
        />
      </View>

      {/* Filtro de Categorias - apenas se showFilters for true */}
      {showFilters && !isCategoriesLoading && categories.length > 0 && (
        <View className="px-4 pb-2">
          <CategoryFilter
            categories={categories.map((c) => ({
              id: Number(c.id),
              nome: c.nome,
              imagem: c.imagem || "",
            }))}
            selectedCategoryId={vm.selectedCategoryId}
            onSelectCategory={vm.setSelectedCategory}
          />
        </View>
      )}

      {/* Products List */}
      <View className="flex-1 px-4 pt-2 pb-20">
        <ProductsList
          products={vm.filteredProducts}
          isLoading={vm.isLoading}
          onEdit={handleEditProduct}
          onDelete={(product) => vm.confirmDeleteProduct(product.id)}
          onView={(product) =>
            router.push(`/admin/products/view/${product.id}`)
          }
          onAddVariation={(product) =>
            router.push(`/admin/products/${product.id}/add-variation`)
          }
          emptyMessage={
            vm.searchTerm
              ? "Nenhum produto encontrado com este termo de busca."
              : "Nenhum produto cadastrado. Adicione seu primeiro produto!"
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[THEME_COLORS.primary]}
              tintColor={THEME_COLORS.primary}
            />
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
    </SafeAreaView>
  );
}
