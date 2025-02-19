// src/features/categories/screens/categories-screen.tsx
import React from "react";
import { CategoriesProvider } from "../contexts/categories-provider";
import { CategoriesContent } from "./categories-content";

export function CategoriesScreen() {
  return (
    <CategoriesProvider>
      <CategoriesContent />
    </CategoriesProvider>
  );
}
