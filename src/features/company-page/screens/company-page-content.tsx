// src/features/company-page/screens/company-page-content.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { CompanyHeader } from "../components/company-header";
import { CompanyProductsGrid } from "../components/company-products-grid";
import { CompanyShowcase } from "../components/company-showcase";
import { CompanyDeliveryInfo } from "../components/company-delivery-info";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ContentContainer } from "@/components/custom/content-container";

export function CompanyPageContent() {
  const vm = useCompanyPageContext();

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View className="space-y-6">
        {/* Header with company info */}
        <CompanyHeader />

        {/* Delivery information */}
        {vm.hasDelivery() && <CompanyDeliveryInfo />}

        {/* Showcase Products */}
        {vm.showcaseProducts.length > 0 && (
          <View className="mt-6">
            <CompanyShowcase
              products={vm.showcaseProducts}
              isLoading={vm.isLoading}
            />
          </View>
        )}

        {/* All Products Grid */}
        <View className="mt-6 mb-8">
          <Text className="text-xl font-semibold mx-4 mb-4">
            Todos os Produtos
          </Text>
          <CompanyProductsGrid
            products={vm.products}
            isLoading={vm.isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}
