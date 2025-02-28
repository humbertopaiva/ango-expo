// Path: src/features/leaflets/components/leaflet-skeleton.tsx
import React from "react";
import { Card, VStack } from "@gluestack-ui/themed";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { HStack } from "@gluestack-ui/themed";
import { View } from "react-native";

/**
 * Skeleton para um item de encarte individual
 */
export function LeafletSkeleton() {
  return (
    <Card className="p-4 bg-white">
      <HStack space="md">
        {/* Imagem ou ícone do encarte */}
        <Skeleton variant="rounded" className="h-16 w-16" />

        {/* Informações do encarte */}
        <VStack space="xs" className="flex-1">
          <SkeletonText _lines={1} className="h-5 w-3/4" />
          <SkeletonText _lines={1} className="h-4 w-1/2" />

          {/* Status */}
          <HStack space="sm" className="mt-1">
            <Skeleton variant="rounded" className="h-6 w-16 rounded-full" />
            <Skeleton variant="rounded" className="h-6 w-24 rounded-full" />
          </HStack>
        </VStack>

        {/* Menu de ações */}
        <Skeleton variant="circular" className="h-8 w-8" />
      </HStack>
    </Card>
  );
}

/**
 * Lista de skeletons para múltiplos encartes
 */
export function LeafletSkeletonList({ count = 3 }) {
  return (
    <View className="gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <LeafletSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
}
