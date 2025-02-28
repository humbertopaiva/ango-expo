// Path: src/features/categories/components/category-skeleton.tsx
import React from "react";
import { Card, VStack } from "@gluestack-ui/themed";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { HStack } from "@gluestack-ui/themed";
import { View } from "react-native";

/**
 * Skeleton para um item de categoria individual
 */
export function CategorySkeleton() {
  return (
    <Card className="p-4 bg-white">
      <HStack space="md">
        {/* Ícone da categoria */}
        <Skeleton variant="rounded" className="h-12 w-12" />

        {/* Informações da categoria */}
        <VStack space="xs" className="flex-1">
          <SkeletonText _lines={1} className="h-5 w-1/2" />

          {/* Status */}
          <Skeleton variant="rounded" className="h-6 w-20 mt-1 rounded-full" />
        </VStack>

        {/* Menu de ações */}
        <Skeleton variant="circular" className="h-8 w-8" />
      </HStack>
    </Card>
  );
}

/**
 * Lista de skeletons para múltiplas categorias
 */
export function CategorySkeletonList({ count = 3 }) {
  return (
    <View className="gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <CategorySkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
}
