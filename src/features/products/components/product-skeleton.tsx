// src/features/products/components/product-skeleton.tsx
import React from "react";
import { Card, VStack } from "@gluestack-ui/themed";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import { HStack } from "@gluestack-ui/themed";

/**
 * Skeleton para um item de produto individual
 */
export function ProductSkeleton() {
  return (
    <Card className="p-4 bg-white">
      <HStack space="md">
        {/* Imagem ou ícone do produto */}
        <Skeleton variant="rounded" className="h-16 w-16" />

        {/* Informações do produto */}
        <VStack space="xs" className="flex-1">
          <SkeletonText _lines={1} className="h-5 w-3/4" />
          <SkeletonText _lines={2} className="h-4 w-full" />

          {/* Preço */}
          <SkeletonText _lines={1} className="h-5 w-1/3 mt-1" />

          {/* Status */}
          <Skeleton variant="rounded" className="h-6 w-24 mt-1 rounded-full" />
        </VStack>

        {/* Menu de ações */}
        <Skeleton variant="circular" className="h-8 w-8" />
      </HStack>
    </Card>
  );
}

/**
 * Lista de skeletons para múltiplos produtos
 */
export function ProductSkeletonList({ count = 3 }) {
  return (
    <Box className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={`skeleton-${index}`} />
      ))}
    </Box>
  );
}
