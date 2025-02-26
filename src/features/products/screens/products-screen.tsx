// Path: src/features/products/screens/products-screen.tsx
import React from "react";
import { ProductsProvider } from "../contexts/products-provider";
import { ProductsContent } from "./products-content";
import { View } from "react-native";
import ScreenHeader from "@/components/ui/screen-header";

export function ProductsScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* <ScreenHeader
        title="Produtos"
        subtitle="Gerencie os produtos da sua loja"
        showBackButton={false}
      /> */}
      <ProductsProvider>
        <ProductsContent />
      </ProductsProvider>
    </View>
  );
}
