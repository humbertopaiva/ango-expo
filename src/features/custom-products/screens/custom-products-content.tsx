// Path: src/features/custom-products/screens/custom-products-content.tsx
import React, { useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useCustomProductsContext } from "../contexts/use-custom-products-context";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Plus, RefreshCw, Package, ListPlus } from "lucide-react-native";
import { router } from "expo-router";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { THEME_COLORS } from "@/src/styles/colors";
import { CustomProductCard } from "../components/custom-product-card";
import { FlatList } from "@gluestack-ui/themed";
import { CustomProduct } from "../models/custom-product";

export function CustomProductsContent() {
  const vm = useCustomProductsContext();

  // Funções de navegação
  const handleAddCustomProduct = () => {
    router.push("/admin/custom-products/new");
  };

  const handleEditCustomProduct = (customProduct: any) => {
    router.push(`/admin/custom-products/${customProduct.id}`);
  };

  // Atualizar apenas as funções de navegação
  const handleViewCustomProduct = (customProduct: any) => {
    router.push(`/admin/custom-products/${customProduct.id}/details`);
  };

  // Para atualizar a lista com pull-to-refresh
  const onRefresh = useCallback(() => {
    vm.refreshCustomProducts();
  }, [vm]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-4 mt-6">
        {/* Card de Informações */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <View className="flex-row items-center border-b border-gray-100 pb-3 mb-3">
            <ListPlus size={20} color={THEME_COLORS.primary} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Gerenciamento de Produtos Personalizados
            </Text>
          </View>
          <Text className="text-gray-600">
            Crie produtos que podem ser personalizados pelos clientes com
            múltiplos passos de escolha
          </Text>
        </View>

        {/* Atualizar manualmente */}
        <View className="bg-blue-50 p-3 mb-4 rounded-lg">
          <TouchableOpacity
            onPress={vm.refreshCustomProducts}
            className="flex-row items-center justify-center"
            disabled={vm.isRefreshing}
          >
            <RefreshCw size={16} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-600 font-medium">
              {vm.isRefreshing ? "Atualizando..." : "Atualizar dados"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de pesquisa */}
        <SearchInput
          value={vm.searchTerm}
          onChangeText={vm.setSearchTerm}
          placeholder="Buscar produtos personalizados..."
          disabled={vm.isLoading || vm.isRefreshing}
        />

        {/* Lista de produtos personalizados */}
        {vm.isLoading ? (
          <View className="flex items-center justify-center py-16 bg-white rounded-xl mt-4">
            <Package size={40} color="#D1D5DB" className="mb-2" />
            <Text className="text-gray-500 text-center">
              Carregando produtos personalizados...
            </Text>
          </View>
        ) : vm.filteredCustomProducts.length === 0 ? (
          <View className="flex items-center justify-center py-12 bg-white rounded-xl mt-4">
            <Package size={48} color="#D1D5DB" className="mb-3" />
            <Text className="text-gray-700 text-lg font-medium">
              Nenhum produto personalizado encontrado
            </Text>
            <Text className="text-gray-500 text-center mt-1 px-8 mb-6">
              Crie um novo produto personalizado para oferecer opções
              customizáveis aos seus clientes
            </Text>
            <TouchableOpacity
              onPress={handleAddCustomProduct}
              className="bg-primary-500 px-6 py-3 rounded-lg flex-row items-center"
            >
              <Plus size={18} color="white" className="mr-2" />
              <Text className="text-white font-medium">Novo Produto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={vm.filteredCustomProducts}
            keyExtractor={(item) => (item as CustomProduct).id}
            renderItem={({ item }: any) => (
              <CustomProductCard
                product={item}
                onEdit={() => handleEditCustomProduct(item)}
                onDelete={() => vm.confirmDeleteCustomProduct(item.id)}
                onView={() => handleViewCustomProduct(item)}
              />
            )}
            contentContainerStyle={{ paddingVertical: 12, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={vm.isRefreshing}
                onRefresh={onRefresh}
                colors={[THEME_COLORS.primary]}
                tintColor={THEME_COLORS.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Botão para adicionar */}
        {vm.filteredCustomProducts.length > 0 && (
          <PrimaryActionButton
            onPress={handleAddCustomProduct}
            label="Novo Produto Personalizado"
            icon={<Plus size={20} color="white" />}
          />
        )}

        {/* Diálogo de confirmação para exclusão */}
        <ConfirmationDialog
          isOpen={vm.isDeleteDialogOpen}
          onClose={vm.cancelDeleteCustomProduct}
          onConfirm={() =>
            vm.customProductToDelete &&
            vm.handleDeleteCustomProduct(vm.customProductToDelete)
          }
          title="Excluir Produto Personalizado"
          message="Tem certeza que deseja excluir este produto personalizado? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          variant="danger"
          isLoading={vm.isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}
