// Path: src/features/delivery/components/delivery-skeleton.tsx
import React from "react";
import { View, Dimensions } from "react-native";

interface DeliverySkeletonProps {
  count?: number;
}

export function DeliverySkeleton({ count = 6 }: DeliverySkeletonProps) {
  const { width } = Dimensions.get("window");

  // Fixo em 2 colunas para todos os tamanhos, exceto telas muito pequenas no mobile
  const columnCount = width < 500 ? 1 : 2;
  const skeletonItems = Array.from({ length: count }, (_, i) => i);

  return (
    <View className="flex-row flex-wrap -mx-2">
      {skeletonItems.map((index) => (
        <View
          key={`skeleton-${index}`}
          style={{
            width: `${100 / columnCount}%`,
            paddingHorizontal: 8,
            marginBottom: 16,
          }}
        >
          <View className="overflow-hidden border border-gray-200 rounded-xl bg-white">
            {/* Banner Skeleton */}
            <View className="h-36 bg-gray-200 animate-pulse" />

            {/* Logo Skeleton */}
            <View className="relative">
              <View className="absolute -top-6 left-3 w-16 h-16 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
            </View>

            {/* Content Skeleton */}
            <View className="p-4 pt-8">
              {/* Title Skeleton */}
              <View className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3" />

              {/* Tags Skeleton */}
              <View className="flex-row mb-4">
                <View className="h-5 w-16 bg-gray-200 rounded-full animate-pulse mr-2" />
                <View className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
              </View>

              {/* Address Skeleton */}
              <View className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-4" />

              {/* Buttons Skeleton */}
              <View className="flex-row mt-2">
                <View className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse mr-2" />
                <View className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse mr-2" />
                <View className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
