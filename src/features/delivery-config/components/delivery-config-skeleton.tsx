// Path: src/features/delivery-config/components/delivery-config-skeleton.tsx

import React from "react";
import { View } from "react-native";
import { Card, VStack } from "@gluestack-ui/themed";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { HStack } from "@gluestack-ui/themed";

export function DeliveryConfigSkeleton() {
  return (
    <Card className="bg-white">
      <VStack space="lg" className="p-4">
        {/* Tempo Estimado */}
        <VStack space="sm">
          <SkeletonText _lines={1} className="h-5 w-64" />
          <Skeleton variant="rounded" className="h-12 w-full rounded-md" />
        </VStack>

        {/* Especificar Bairros */}
        <VStack space="sm">
          <SkeletonText _lines={1} className="h-5 w-72" />
          <HStack space="sm" alignItems="center">
            <Skeleton variant="circular" className="h-6 w-6" />
            <SkeletonText _lines={1} className="h-5 w-40" />
          </HStack>
        </VStack>

        {/* Taxa de Entrega */}
        <VStack space="sm">
          <SkeletonText _lines={1} className="h-5 w-36" />
          <Skeleton variant="rounded" className="h-12 w-full rounded-md" />
        </VStack>

        {/* Pedido Mínimo */}
        <VStack space="sm">
          <SkeletonText _lines={1} className="h-5 w-36" />
          <Skeleton variant="rounded" className="h-12 w-full rounded-md" />
        </VStack>

        {/* Observações */}
        <VStack space="sm">
          <SkeletonText _lines={1} className="h-5 w-28" />
          <Skeleton variant="rounded" className="h-32 w-full rounded-md" />
        </VStack>

        {/* Botões */}
        <HStack space="md" className="mt-4">
          <Skeleton variant="rounded" className="h-12 flex-1 rounded-md" />
          <Skeleton variant="rounded" className="h-12 flex-1 rounded-md" />
        </HStack>
      </VStack>
    </Card>
  );
}
