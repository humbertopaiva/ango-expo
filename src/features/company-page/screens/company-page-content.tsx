// Path: src/features/company-page/screens/company-page-content.tsx
import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
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

export function CompanyPageContent() {
  const vm = useCompanyPageContext();
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Estado para armazenar informações do header
  const [companyTitle, setCompanyTitle] = useState<string>("");
  const [companySubtitle, setCompanySubtitle] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#4B5563"); // gray-700 default
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  // Reset category filter store when unmounting/changing companies
  const resetCategoryFilter = useCategoryFilterStore((state) => state.reset);

  useEffect(() => {
    return () => {
      // Reset filter store when component unmounts
      resetCategoryFilter();
    };
  }, []);

  const handleOpenInfoModal = () => {
    setInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalVisible(false);
  };

  // Verificar se deve mostrar informações de delivery separadamente
  const shouldShowDeliveryInfo = () => {
    return (
      vm.hasDelivery() &&
      vm.config?.delivery &&
      // Se app.mostrar_info_delivery for false, não mostrar
      // Se app não existir ou mostrar_info_delivery for null, mostrar (comportamento padrão)
      !(
        vm.config?.delivery?.mostrar_info_delivery === true ||
        vm.config?.delivery?.mostrar_info_delivery === null
      )
    );
  };

  // Verificar se o carrinho está habilitado
  const isCartEnabled = () => {
    return vm.config?.delivery?.habilitar_carrinho !== false; // Por padrão, se não estiver definido, considera como true
  };

  // Configurar informações do header quando o perfil estiver disponível
  useEffect(() => {
    if (vm.profile) {
      setCompanyTitle(vm.profile.nome);

      // Definir subtítulo baseado na categoria, se disponível
      if (vm.profile.empresa?.categoria) {
        setCompanySubtitle(vm.profile.empresa.categoria.nome);
        setCategorySlug(vm.profile.empresa.categoria.slug); // Salvar o slug da categoria
      }

      // Definir cor primária da empresa ou usar cinza escuro como fallback
      if (vm.profile.cor_primaria) {
        setPrimaryColor(vm.profile.cor_primaria);
      }
    }
  }, [vm.profile]);

  // Handler para voltar para a categoria
  const handleBackPress = () => {
    router.back();
  };

  if (vm.isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        {/* Um header vazio para manter o layout consistente durante o carregamento */}
        <CompanySpecificHeader
          title="Carregando..."
          onBackPress={() => router.back()}
        />
        <View className="flex-1 justify-center items-center">
          {/* Aqui você pode adicionar um indicador de carregamento se desejar */}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 relative">
      {/* Header específico da empresa */}
      <CompanySpecificHeader
        title={companyTitle}
        subtitle={companySubtitle}
        primaryColor={primaryColor}
        onBackPress={handleBackPress}
      />

      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // Important for tracking scroll position
        onScroll={(event) => {
          // Manual dispatch of scroll event to children
          const { y } = event.nativeEvent.contentOffset;
          console.log("Main scroll position:", y);
        }}
      >
        <View>
          {/* Cabeçalho da empresa */}
          <CompanyHeader onMoreInfoPress={handleOpenInfoModal} />

          {/* Galeria de imagens da empresa */}
          <CompanyGallery />

          {/* Produtos personalizados */}
          <CustomProductsSection />

          {/* Produtos em destaque (da vitrine) */}
          {vm.showcaseProducts && vm.showcaseProducts.length > 0 && (
            <FeaturedProductsStrip />
          )}

          {/* Produtos agrupados por categoria */}
          <ProductsByCategory title={"Produtos"} />
        </View>
      </ScrollView>

      {/* Barra de ações fixa no rodapé (apenas se o carrinho estiver habilitado) */}
      {isCartEnabled() && <CompanyActionBar />}

      {/* Modal com informações detalhadas da empresa */}
      <CompanyInfoModal
        isVisible={isInfoModalVisible}
        onClose={handleCloseInfoModal}
      />
    </View>
  );
}
