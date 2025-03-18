// Path: src/features/company-page/screens/company-page-content.tsx
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { FeaturedProductsStrip } from "../components/featured-products-strip";
import { CompanyDeliveryInfo } from "../components/company-delivery-info";
import { CompanyHeader } from "../components/company-header";
import { ProductsByCategory } from "../components/products-by-category";
import { CompanyActionBar } from "../components/company-action-bar";
import { CompanyInfoModal } from "../components/company-info-modal";
import { ScrollView } from "react-native-gesture-handler";
import { CompanySpecificHeader } from "../components/company-specific-header";
import { router } from "expo-router";

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

  const handleOpenInfoModal = () => {
    setInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalVisible(false);
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
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Cabeçalho da empresa */}
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
          <ProductsByCategory title={"Produtos"} />
        </View>
      </ScrollView>

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
