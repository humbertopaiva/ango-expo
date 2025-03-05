// src/features/delivery/screens/delivery-screen-content.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useDeliveryPageContext } from "../contexts/use-delivery-page-context";
import { DeliveryCard } from "../components/delivery-card";
import { DeliverySubcategoriesTabs } from "../components/delivery-subcategories-tabs";
import { DeliveryShowcase } from "../components/delivery-showcase";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ui/screen-header";

export function DeliveryScreenContent() {
  const vm = useDeliveryPageContext();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader
        title="Delivery"
        subtitle="Peça e receba em casa"
        showBackButton={false}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Subcategorias */}
        <DeliverySubcategoriesTabs
          subcategories={vm.subcategories}
          selectedSubcategory={vm.selectedSubcategory}
          onSelectSubcategory={vm.setSelectedSubcategory}
          isLoading={vm.isLoading}
        />

        {/* Estabelecimentos */}
        <View className="px-4 mb-8">
          <Text className="text-2xl font-bold mb-4">
            Estabelecimentos com Delivery
          </Text>
          {vm.profiles.map((profile) => (
            <DeliveryCard
              key={`delivery-profile-${profile.id}`}
              profile={profile}
              onPress={() => {
                // Implementar navegação para detalhes do estabelecimento
                console.log(`Navegar para: ${profile.nome}`);
              }}
            />
          ))}
        </View>

        {/* Produtos em destaque */}
        <View className="px-4 mb-4">
          <Text className="text-2xl font-bold mb-4">Produtos em Destaque</Text>
          {Object.entries(vm.showcaseProducts).map(([slug, products]) => {
            const profile = vm.profiles.find((p) => p.empresa.slug === slug);
            if (!profile || products.length === 0) return null;

            return (
              <DeliveryShowcase
                key={`showcase-${slug}`}
                products={products}
                companyName={profile.nome}
                isLoading={vm.isLoading}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
