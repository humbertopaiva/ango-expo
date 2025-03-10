// Path: src/features/company-page/screens/enhanced-company-page-content.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { FeaturedProducts } from "../components/featured-products";
import { CompanyDeliveryInfo } from "../components/company-delivery-info";
import { CompanyHeader } from "../components/company-header";
import { ProductsGrid } from "../components/company-products-grid";

/**
 * Conteúdo principal da página da empresa com layout aprimorado
 */
export function CompanyPageContent() {
  const vm = useCompanyPageContext();

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {/* Cabeçalho da empresa com banner, logo e informações */}
        <CompanyHeader />

        {/* Informações de entrega (se a empresa oferecer) */}
        {vm.hasDelivery() && <CompanyDeliveryInfo />}

        {/* Produtos em destaque (da vitrine) */}
        {vm.showcaseProducts && vm.showcaseProducts.length > 0 && (
          <FeaturedProducts />
        )}

        {/* Grade de todos os produtos com pesquisa e filtros */}
        <ProductsGrid
          title="Todos os Produtos"
          onProductPress={(product) => {
            // Aqui você pode implementar a navegação para a página de detalhes do produto
            console.log("Produto selecionado:", product.nome);
          }}
        />
      </View>
    </ScrollView>
  );
}
