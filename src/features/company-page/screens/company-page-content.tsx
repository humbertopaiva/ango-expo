// Path: src/features/company-page/screens/company-page-content.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { FeaturedProductsStrip } from "../components/featured-products-strip";
import { CompanyHeader } from "../components/company-header";
import { ProductsByCategory } from "../components/products-by-category";
import { CompanyActionBar } from "../components/company-action-bar";
import { CompanyInfoModal } from "../components/company-info-modal";
import { CompanySpecificHeader } from "../components/company-specific-header";
import { router } from "expo-router";
import { CompanyGallery } from "../components/company-gallery";
import { CustomProductsSection } from "../components/custom-products-section";
import { useCategoryFilterStore } from "../stores/category-filter.store";
import { memo } from "react";

import { AnimatedPageTransition } from "@/components/animations/animated-page-transition";
import { Loader } from "@/components/common/loader";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyTabBar } from "../components/company-tab-bar";

// Utilizando memo para evitar renderizações desnecessárias
const MemoizedFeaturedProductsStrip = memo(FeaturedProductsStrip);
const MemoizedProductsByCategory = memo(ProductsByCategory);
const MemoizedCompanyGallery = memo(CompanyGallery);
const MemoizedCustomProductsSection = memo(CustomProductsSection);

export function CompanyPageContent() {
  const vm = useCompanyPageContext();
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Estado para armazenar informações do header
  const [companyTitle, setCompanyTitle] = useState<string>("");
  const [companySubtitle, setCompanySubtitle] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#4B5563"); // gray-700 default
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  // Scroll position reference for header animations
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset category filter store when unmounting/changing companies
  const resetCategoryFilter = useCategoryFilterStore((state) => state.reset);

  useEffect(() => {
    return () => {
      // Reset filter store when component unmounts
      resetCategoryFilter();
    };
  }, [resetCategoryFilter]);

  // Use useCallback para evitar recriações desnecessárias de funções
  const handleOpenInfoModal = useCallback(() => {
    setInfoModalVisible(true);
  }, []);

  const handleCloseInfoModal = useCallback(() => {
    setInfoModalVisible(false);
  }, []);

  // Handle scroll events to trigger header changes - usando useCallback
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      setScrollY(currentScrollY);
    },
    []
  );

  // Configurar informações do header quando o perfil estiver disponível
  useEffect(() => {
    if (vm.profile) {
      setCompanyTitle(vm.profile.nome);

      // Definir subtítulo baseado na categoria, se disponível
      if (vm.profile.empresa?.categoria) {
        setCompanySubtitle(vm.profile.empresa.categoria.nome);
        setCategorySlug(vm.profile.empresa.categoria.slug);
      }

      // Definir cor primária da empresa ou usar cinza escuro como fallback
      if (vm.profile.cor_primaria) {
        setPrimaryColor(vm.profile.cor_primaria);
      }
    }
  }, [vm.profile]);

  // Handler para voltar para a categoria - usando useCallback
  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  return (
    <AnimatedPageTransition animation="slide" duration={600}>
      <View className="flex-1 relative">
        {/* Header da empresa - agora fixo, sem animação de desaparecimento */}
        {/* Header específico da empresa com posição de scroll */}
        <CompanySpecificHeader
          title={companyTitle}
          subtitle={companySubtitle}
          primaryColor={THEME_COLORS.primary}
          onBackPress={handleBackPress}
          scrollPosition={scrollY}
        />

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-white"
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16} // Importante para rastrear a posição de rolagem
          onScroll={handleScroll}
        >
          <View>
            {/* Cabeçalho da empresa - Agora fixo, sem animação de desaparecimento */}
            <CompanyHeader onMoreInfoPress={handleOpenInfoModal} />

            {/* Galeria de imagens da empresa */}
            <MemoizedCompanyGallery />

            {/* Produtos personalizados */}
            <MemoizedCustomProductsSection />

            {/* Produtos agrupados por categoria */}
            <MemoizedProductsByCategory title={"Produtos"} />
          </View>
        </ScrollView>

        {/* Barra de ações fixa no rodapé (apenas se o carrinho estiver habilitado) */}
        <CompanyTabBar activeTab="home" />

        {/* Modal com informações detalhadas da empresa */}
        <CompanyInfoModal
          isVisible={isInfoModalVisible}
          onClose={handleCloseInfoModal}
        />
      </View>
    </AnimatedPageTransition>
  );
}
