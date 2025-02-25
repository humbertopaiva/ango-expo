// src/features/products/components/product-form-skeleton.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

/**
 * Componente de skeleton para o cartão de formulário
 */
function SkeletonCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
      <SkeletonText _lines={1} className="h-6 w-40 mb-4" />
      {children}
    </Box>
  );
}

/**
 * Componente de skeleton para campo de formulário
 */
function SkeletonField({ labelWidth = "w-1/4", inputHeight = "h-10" }) {
  return (
    <VStack space="xs" className="mb-4">
      <SkeletonText _lines={1} className="h-4 w-32" />
      <Skeleton variant="rounded" className={`${inputHeight} w-full`} />
    </VStack>
  );
}

/**
 * Componente de skeleton para switch com texto
 */
function SkeletonSwitch({ textWidth = "w-2/4" }) {
  return (
    <HStack space="sm" className="mb-4 items-center">
      <Skeleton variant="circular" className="h-6 w-6" />
      <SkeletonText _lines={1} className={`h-4 ${textWidth}`} />
    </HStack>
  );
}

/**
 * Skeleton completo para o formulário de produto
 */
export function ProductFormSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Skeleton */}
      <Box className="px-4 py-4 border-b border-gray-200">
        <SkeletonText _lines={1} className="h-6 w-40" />
      </Box>

      {/* Form Skeleton */}
      <ScrollView className="flex-1 px-4">
        <VStack space="lg" className="py-6">
          {/* Informações básicas */}
          <SkeletonCard title="Informações Básicas">
            <SkeletonField labelWidth="w-28" />
            <SkeletonField labelWidth="w-32" inputHeight="h-24" />
            <SkeletonField labelWidth="w-24" />
          </SkeletonCard>

          {/* Imagem */}
          <SkeletonCard title="Imagem do Produto">
            <Skeleton
              variant="rounded"
              className="w-full aspect-[4/3] rounded-lg"
            />
          </SkeletonCard>

          {/* Preços */}
          <SkeletonCard title="Preços">
            <SkeletonField labelWidth="w-20" />
            <SkeletonField labelWidth="w-40" />
          </SkeletonCard>

          {/* Status */}
          <SkeletonCard title="Status do Produto">
            <SkeletonField labelWidth="w-16" />
          </SkeletonCard>

          {/* Opções de Pagamento */}
          <SkeletonCard title="Opções de Pagamento">
            <SkeletonSwitch textWidth="w-48" />
            <SkeletonField labelWidth="w-56" />
            <SkeletonSwitch textWidth="w-40" />
            <SkeletonField labelWidth="w-40" />
          </SkeletonCard>
        </VStack>
      </ScrollView>

      {/* Footer Skeleton */}
      <Box className="px-4 py-4 border-t border-gray-200">
        <HStack space="md">
          <Skeleton variant="rounded" className="h-10 flex-1" />
          <Skeleton variant="rounded" className="h-10 flex-1" />
        </HStack>
      </Box>
    </SafeAreaView>
  );
}
