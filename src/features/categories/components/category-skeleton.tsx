// Path: src/features/categories/components/category-skeleton.tsx
import React from "react";
import { View } from "react-native";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { HStack, VStack } from "@gluestack-ui/themed";

/**
 * Skeleton para um item de categoria individual
 */
export function CategorySkeleton() {
  return (
    <View className="bg-white p-4 rounded-lg border border-gray-200 mb-3 shadow-sm">
      <HStack space="md" alignItems="center">
        {/* Ícone da categoria */}
        <Skeleton variant="rounded" className="h-10 w-10" />

        {/* Informações da categoria */}
        <VStack space="xs" className="flex-1">
          <SkeletonText _lines={1} className="h-5 w-1/2" />

          {/* Badge de status */}
          <View className="flex-row">
            <Skeleton variant="rounded" className="h-6 w-16 rounded-full" />
          </View>
        </VStack>

        {/* Botões de ação */}
        <HStack space="sm">
          <Skeleton variant="rounded" className="h-10 w-10" />
          <Skeleton variant="rounded" className="h-10 w-10" />
        </HStack>
      </HStack>
    </View>
  );
}

/**
 * Lista de skeletons para múltiplas categorias
 */
export function CategorySkeletonList({ count = 3 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <CategorySkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
}
