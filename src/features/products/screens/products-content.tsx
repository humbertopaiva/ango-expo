// src/features/products/screens/products-content.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductsContext } from "../contexts/use-products-context";
import { ProductsList } from "../components/products-list";
import { Plus, Search } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";

export function ProductsContent() {
  const vm = useProductsContext();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4">
        {/* Header */}
        <ScreenHeader
          title="Produtos"
          subtitle="Gerencie os produtos da sua loja"
          action={{
            label: "Novo Produto",
            icon: Plus,
            onPress: () => router.push("/(app)/admin/products/new"),
          }}
        />

        {/* Search */}
        <View className="mb-4">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={20} color="#6B7280" />
            </View>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Buscar produtos..."
                value={vm.searchTerm}
                onChangeText={vm.setSearchTerm}
                className="pl-10"
              />
            </Input>
          </View>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProductsList
            products={vm.products}
            isLoading={vm.isLoading}
            onEdit={(product) => {
              router.push(`/(app)/admin/products/${product.id}` as any);
            }}
            onDelete={(product) => vm.handleDeleteProduct(product.id)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
