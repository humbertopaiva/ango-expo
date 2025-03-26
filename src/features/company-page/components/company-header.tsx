// Path: src/features/company-page/components/company-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import {
  Info,
  Store,
  MessageCircle,
  Clock,
  Truck,
  DollarSign,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OpenStatusIndicator } from "@/components/custom/open-status-indicator";
import { isBusinessOpen } from "@/src/utils/business-hours.utils";

interface CompanyHeaderProps {
  onMoreInfoPress?: () => void;
}

export function CompanyHeader({ onMoreInfoPress }: CompanyHeaderProps) {
  const vm = useCompanyPageContext();
  const insets = useSafeAreaInsets();

  if (!vm.profile) return null;

  // Handler para WhatsApp
  const handleWhatsApp = async () => {
    const whatsappLink = vm.getWhatsAppLink();
    if (whatsappLink) {
      await Linking.openURL(whatsappLink);
    }
  };

  // Verificar se o estabelecimento está aberto
  const open = isBusinessOpen(vm.profile);

  // Definir estilos baseados na cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Verificar se deve mostrar informações de delivery
  const shouldShowDeliveryInfo = () => {
    return (
      vm.hasDelivery() &&
      vm.config?.delivery &&
      (vm.config?.delivery?.mostrar_info_delivery === true ||
        vm.config?.delivery?.mostrar_info_delivery === null)
    );
  };

  // Formatar valores monetários
  const formatCurrency = (value: string) => {
    if (!value) return "Grátis";
    const numValue = parseFloat(value) / 100;
    return numValue === 0
      ? "Grátis"
      : numValue.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  };

  return (
    <View className="relative mb-4">
      {/* Banner */}
      <View className="w-full relative overflow-hidden" style={{ height: 180 }}>
        <ImagePreview
          uri={vm.profile.banner}
          fallbackIcon={Store}
          width="100%"
          height="100%"
          resizeMode="cover"
          containerClassName={vm.profile.banner ? "" : "bg-gray-100"}
          rounded={false}
        />

        {/* Gradiente para melhorar legibilidade do conteúdo */}
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
      </View>

      {/* Indicador de aberto/fechado */}
      <View className="absolute top-4 right-4">
        <OpenStatusIndicator isOpen={open} />
      </View>

      {/* Conteúdo principal */}
      <View className="px-4 -mt-16 relative z-10">
        <Card className="p-4 rounded-xl">
          <HStack space="lg" alignItems="flex-start">
            {/* Logo */}
            <View className="w-20 h-20 rounded-xl border-2 border-white overflow-hidden bg-white">
              <ImagePreview
                uri={vm.profile.logo}
                fallbackIcon={Store}
                width="100%"
                height="100%"
                containerClassName="bg-gray-100"
              />
            </View>

            {/* Informações da empresa */}
            <VStack className="flex-1">
              <Text className="text-xl font-semibold text-gray-800">
                {vm.profile.nome}
              </Text>

              {vm.profile.empresa?.categoria && (
                <Text className="text-sm text-gray-600 mb-1 font-sans">
                  {vm.profile.empresa.categoria.nome}
                </Text>
              )}

              <View className="flex-row flex-wrap gap-1 mt-1">
                {vm.profile.empresa?.subcategorias?.map((sub) => (
                  <View
                    key={sub.subcategorias_empresas_id.id}
                    className="px-2 py-0.5 bg-gray-100 rounded-full"
                  >
                    <Text className="text-xs text-gray-700 font-sans">
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                ))}
              </View>
            </VStack>
          </HStack>

          {/* INÍCIO: Seção de Informações de Delivery */}
          {shouldShowDeliveryInfo() && vm.config?.delivery && (
            <View className="mt-4 pt-4 border-t border-gray-100">
              {/* Informações do Delivery */}
              <View className="flex-row justify-between items-center">
                {/* Tempo estimado */}
                {vm.config.delivery.tempo_estimado_entrega && (
                  <View className="flex-1 items-center border-r border-gray-100 pr-2">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mb-1"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <Clock size={16} color={primaryColor} />
                    </View>
                    <Text className="text-xs text-gray-500">
                      Tempo Estimado
                    </Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {vm.config.delivery.tempo_estimado_entrega} min
                    </Text>
                  </View>
                )}

                {/* Taxa de entrega */}
                <View className="flex-1 items-center px-2">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mb-1"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <DollarSign size={16} color={primaryColor} />
                  </View>
                  <Text className="text-xs text-gray-500">Taxa de Entrega</Text>
                  <Text className="text-sm font-medium text-gray-800">
                    {formatCurrency(vm.config.delivery.taxa_entrega || "0")}
                  </Text>
                </View>

                {/* Pedido mínimo, se existir */}
                {vm.config.delivery.pedido_minimo && (
                  <View className="flex-1 items-center border-l border-gray-100 pl-2">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mb-1"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <DollarSign size={16} color={primaryColor} />
                    </View>
                    <Text className="text-xs text-gray-500">Pedido Mínimo</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {formatCurrency(vm.config.delivery.pedido_minimo)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          {/* FIM: Seção de Informações de Delivery */}

          {/* Botões de ação */}
          <View className="flex-row mt-4 gap-2">
            {/* WhatsApp (apenas se disponível) */}
            {vm.profile.whatsapp && (
              <TouchableOpacity
                onPress={handleWhatsApp}
                className="flex-1 py-3 bg-green-500 rounded-lg flex-row justify-center items-center"
              >
                <MessageCircle size={18} color="white" />
                <Text className="ml-2 font-semibold text-white">WhatsApp</Text>
              </TouchableOpacity>
            )}

            {/* Mais informações */}
            <TouchableOpacity
              onPress={onMoreInfoPress}
              className="flex-1 py-3 bg-gray-100 rounded-lg flex-row justify-center items-center"
            >
              <Info size={18} color={primaryColor} />
              <Text
                className="ml-2 font-semibold"
                style={{ color: primaryColor }}
              >
                Informações
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </View>
  );
}
