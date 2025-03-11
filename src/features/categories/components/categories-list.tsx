// Path: src/features/categories/components/categories-list.tsx
import React from "react";
import { SwipeableDataList } from "@/components/custom/swipeable-data-list";
import { Grid } from "lucide-react-native";
import { Category } from "../models/category";
import { CategorySkeletonList } from "./category-skeleton";

interface CategoriesListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onItemPress?: (category: Category) => void;
}

export function CategoriesList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onItemPress,
}: CategoriesListProps) {
  return (
    <SwipeableDataList
      data={categories}
      isLoading={isLoading}
      emptyMessage="Nenhuma categoria encontrada. Crie uma nova categoria para começar."
      renderSkeleton={() => <CategorySkeletonList count={3} />}
      keyExtractor={(category) => category.id}
      getTitle={(category) => category.nome}
      getImageIcon={() => Grid}
      getStatus={(category) => (category.categoria_ativa ? "ativa" : "inativa")}
      onEdit={onEdit}
      onDelete={onDelete}
      onItemPress={onItemPress}
    />
  );
}
