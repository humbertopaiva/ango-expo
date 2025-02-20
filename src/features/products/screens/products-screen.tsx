// src/features/products/screens/products-screen.tsx
import React from "react";
import { ProductsProvider } from "../contexts/products-provider";
import { ProductsContent } from "./products-content";

export function ProductsScreen() {
  return (
    <ProductsProvider>
      <ProductsContent />
    </ProductsProvider>
  );
}
