// src/features/products/screens/products-screen.tsx
import React from "react";
import { ProductsProvider } from "../contexts/products-provider";
import { ProductsContent } from "./products-content";
import { View } from "@gluestack-ui/themed";

export function ProductsScreen() {
  return (
    <ProductsProvider>
      <ProductsContent />
    </ProductsProvider>
  );
}
