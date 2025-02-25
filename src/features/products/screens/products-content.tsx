// src/features/products/screens/products-content.tsx
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { Plus } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export function ProductsContent() {
  const vm = useProductsContext();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            router.push("/(app)/admin/products/new");
          }}
          style={{ padding: 10 }}
        >
          <AntDesign
            name="pluscircle"
            size={24}
            className="color-primary-500"
          />
        </Pressable>
      ),
    });
  }, [navigation]);

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
