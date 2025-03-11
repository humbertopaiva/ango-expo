// Path: src/features/company-page/screens/company-page-content.tsx
import React, { useState, useRef } from "react";
import { View, Animated, ScrollView } from "react-native";
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
  const scrollY = useRef(new Animated.Value(0)).current;
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  const handleOpenInfoModal = () => {
    setInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalVisible(false);
  };

  // Handler para o evento de scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View className="flex-1 bg-gray-50 relative">
      <Animated.ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
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

          {/* Produtos agrupados por categoria com scroll e filtro fixo */}
          <ProductsByCategory
            title={isDeliveryPlan ? "Cardápio" : "Nossos Produtos"}
            scrollY={scrollY}
          />
        </View>
      </Animated.ScrollView>

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
