// Path: src/features/commerce/screens/commerce-screen-content.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useCommerceContext } from "../contexts/use-commerce-context";
import { CategoryGrid } from "../components/category-grid";
import { LeafletCarousel } from "../components/leaflet-carousel";
import { ShowcaseGrid } from "../components/showcase-grid";
import { ShowcaseProducts } from "../components/showcase-products";
import { SafeAreaView } from "react-native-safe-area-context";
import { Section } from "@/components/custom/section";
import { PromotionalBanner } from "../components/promotional-banner";

export function CommerceScreenContent() {
  const vm = useCommerceContext();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Promocional */}
        <View className="px-4 pt-4">
          <PromotionalBanner />
        </View>

        {/* Categorias */}
        <Section className="mt-4">
          <CategoryGrid categories={vm.categories} isLoading={vm.isLoading} />
        </Section>

        {/* Últimos Encartes */}
        <Section className="mt-8 bg-secondary-50/30 py-8">
          <LeafletCarousel
            leaflets={vm.latestLeaflets}
            isLoading={vm.isLoading}
          />
        </Section>

        {/* Vitrines Atualizadas */}
        <Section className="mt-8">
          <ShowcaseGrid
            companies={vm.showcaseCompanies}
            isLoading={vm.isLoading}
          />

          {vm.showcaseCompanies.map((company) => (
            <ShowcaseProducts
              key={company.id}
              products={vm.showcaseProducts[company.slug] || []}
              isLoading={vm.isLoadingProducts}
              companyName={company.nome}
              companySlug={company.slug}
            />
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
