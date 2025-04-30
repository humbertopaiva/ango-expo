// Path: src/features/company-page/components/company-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import {
  Info,
  Store,
  Clock,
  Truck,
  DollarSign,
  ChevronRight,
  InfoIcon,
  ArrowLeft,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isBusinessOpen } from "@/src/utils/business-hours.utils";
import { router } from "expo-router";

interface CompanyHeaderProps {
  onMoreInfoPress?: () => void;
}

export function CompanyHeader({ onMoreInfoPress }: CompanyHeaderProps) {
  const vm = useCompanyPageContext();
  const insets = useSafeAreaInsets();

  if (!vm.profile) return null;

  // Verificar se o estabelecimento está aberto
  const open = isBusinessOpen(vm.profile);

  // Definir estilos baseados na cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";
  const statusColor = open ? "#22c55e" : "#ef4444"; // Verde ou vermelho
  const statusText = open ? "Aberto" : "Fechado";

  // Verificar se deve mostrar informações de delivery
  const shouldShowDeliveryInfo = () =>
    vm.hasDelivery() &&
    vm.config?.delivery &&
    (vm.config?.delivery?.mostrar_info_delivery === true ||
      vm.config?.delivery?.mostrar_info_delivery === null);

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

  // Handler para botão de voltar
  const handleBack = () => {
    router.back();
  };

  return (
    <View className="relative mb-4">
      {/* Banner */}
      <View className="w-full relative overflow-hidden" style={{ height: 140 }}>
        <ImagePreview
          uri={vm.profile.banner}
          fallbackIcon={Store}
          width="100%"
          height="100%"
          resizeMode="cover"
          containerClassName={vm.profile.banner ? "" : "bg-gray-100"}
          rounded={false}
        />
        {/* Gradiente para melhorar legibilidade */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        {/* Header actions - Back button and Logo */}
        <View
          style={{
            position: "absolute",
            top: insets.top || 16,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            zIndex: 10,
          }}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* App logo */}
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={{ height: 32, width: 64 }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Conteúdo principal */}
      <View className="px-4 relative z-10">
        <Box className="mt-4">
          {/* Cabeçalho: Nome, Categorias, Logo e Status */}
          <HStack
            justifyContent="space-between"
            alignItems="flex-start"
            className="mb-4 w-full"
          >
            {/* Informações do estabelecimento */}
            <VStack className="flex-1 pr-2">
              <Text className="text-2xl tracking-tight font-bold text-gray-800">
                {vm.profile.nome}
              </Text>
              <View className="flex-row flex-wrap gap-1 mt-1">
                {vm.profile.empresa?.subcategorias?.map((sub) => (
                  <View
                    key={sub.subcategorias_empresas_id.id}
                    className="px-2 py-0.5 bg-gray-200 rounded-full"
                  >
                    <Text className="text-xs text-gray-700">
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                ))}
              </View>
            </VStack>

            {/* Logo e Status */}
            <VStack alignItems="center" className="-mt-16">
              <View
                className="w-24 h-24 rounded-lg border-2 overflow-hidden bg-white"
                style={{ borderColor: statusColor }}
              >
                <ImagePreview
                  uri={vm.profile.logo}
                  fallbackIcon={Store}
                  width="100%"
                  height="100%"
                  containerClassName="bg-gray-100"
                />
              </View>
              <View className="mt-1">
                <Text
                  className="text-sm font-medium"
                  style={{ color: statusColor }}
                >
                  {statusText}
                </Text>
              </View>
            </VStack>
          </HStack>

          {/* Informações de entrega integradas */}
          {shouldShowDeliveryInfo() && vm.config?.delivery && (
            <TouchableOpacity
              onPress={onMoreInfoPress}
              className="mt-3 py-2 border-t border-gray-100 w-full"
            >
              <View className="w-full px-2 rounded-md">
                <HStack className="w-full justify-between">
                  {/* Tempo estimado */}
                  {vm.config.delivery.tempo_estimado_entrega && (
                    <VStack alignItems="center" space="xs" className="mb-1">
                      <HStack space="xs" className="items-center">
                        <Clock size={14} color={primaryColor} />
                        <Text className="text-sm font-semibold text-gray-800">
                          {vm.config.delivery.tempo_estimado_entrega} min
                        </Text>
                      </HStack>

                      <Text className="text-xs font-medium text-gray-500 ml-1">
                        Tempo estimado
                      </Text>
                    </VStack>
                  )}

                  {/* Taxa de entrega */}
                  <VStack alignItems="center" space="xs" className="mb-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: primaryColor }}
                      >
                        R$
                      </Text>
                      {formatCurrency(
                        vm.config.delivery.taxa_entrega || "0"
                      ).replace("R$", "")}
                    </Text>
                    <Text className="text-xs font-medium text-gray-500 ml-1">
                      Taxa de Entrega
                    </Text>
                  </VStack>

                  {/* Pedido mínimo */}
                  {vm.config.delivery.pedido_minimo && (
                    <VStack alignItems="center" space="xs" className="mb-1">
                      <HStack space="xs" className="items-center">
                        <Truck size={14} color={primaryColor} />
                        <Text className="text-sm font-semibold text-gray-800">
                          {formatCurrency(vm.config.delivery.pedido_minimo)}
                        </Text>
                      </HStack>

                      <Text className="text-xs font-medium text-gray-500 ml-1">
                        Pedido mínimo
                      </Text>
                    </VStack>
                  )}

                  {/* Botão de Informações */}
                  <TouchableOpacity
                    onPress={onMoreInfoPress}
                    className="py-3 flex-col justify-center items-center aspect-square"
                  >
                    <Info size={28} color={primaryColor} />
                  </TouchableOpacity>
                </HStack>
              </View>
            </TouchableOpacity>
          )}
        </Box>
      </View>
    </View>
  );
}
