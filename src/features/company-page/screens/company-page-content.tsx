// Path: src/features/company-page/screens/company-page-content.tsx
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { FeaturedProductsStrip } from "../components/featured-products-strip";
import { CompanyDeliveryInfo } from "../components/company-delivery-info";
import { CompanyHeader } from "../components/company-header";
import { ProductsByCategory } from "../components/products-by-category";
import { CompanyActionBar } from "../components/company-action-bar";
import { CartFAB } from "../components/cart-fab";
import { CompanyInfoModal } from "../components/company-info-modal";

export function CompanyPageContent() {
  const vm = useCompanyPageContext();
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  const handleOpenInfoModal = () => {
    setInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-50 relative">
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Cabeçalho da empresa com banner, logo e informações */}
          <CompanyHeader onMoreInfoPress={handleOpenInfoModal} />

          {/* Informações de entrega (se a empresa oferecer) */}
          {vm.hasDelivery() && (
            <CompanyDeliveryInfo onMoreInfoPress={handleOpenInfoModal} />
          )}

          {/* Produtos em destaque (da vitrine) */}
          {vm.showcaseProducts && vm.showcaseProducts.length > 0 && (
            <FeaturedProductsStrip />
          )}

          {/* Produtos agrupados por categoria */}
          <ProductsByCategory
            title={isDeliveryPlan ? "Cardápio" : "Nossos Produtos"}
          />
        </View>
      </ScrollView>

      {/* Botão flutuante do carrinho */}
      <CartFAB />

      {/* Barra de ações fixa no rodapé */}
      <CompanyActionBar />

      {/* Modal com informações detalhadas da empresa */}
      <CompanyInfoModal
        isVisible={isInfoModalVisible}
        onClose={handleCloseInfoModal}
      />
    </View>
  );
}
