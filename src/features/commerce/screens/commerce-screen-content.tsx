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
import { LatestCompaniesCarousel } from "../components/latest-companies-carousel";

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
        <Section className="my-6">
          <CategoryGrid categories={vm.categories} isLoading={vm.isLoading} />
        </Section>

        {/* Últimos Encartes */}
        <Section className="my-6">
          <LeafletCarousel
            leaflets={vm.latestLeaflets}
            isLoading={vm.isLoading}
          />
        </Section>

        {/* Vitrines Atualizadas */}
        <Section className="my-6">
          {/* <ShowcaseGrid
            companies={vm.showcaseCompanies}
            isLoading={vm.isLoading}
          /> */}

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
